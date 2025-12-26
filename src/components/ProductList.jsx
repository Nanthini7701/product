import React, { useMemo, useState, useEffect } from 'react'
import productsData from '../data/products.json'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import Cart from './Cart'
import './ProductList.css'

export default function ProductList(){
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch{ return [] }
  })
  const [selected, setSelected] = useState(null)

  useEffect(()=>{ localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])

  const categories = useMemo(()=>{
    const cats = new Set(productsData.map(p=>p.category))
    return ['All', ...Array.from(cats)]
  },[])

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    return productsData.filter(p=>{
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q)
      const matchesCat = category==='All' || p.category === category
      return matchesQuery && matchesCat
    })
  }, [query, category])

  function handleAdd(product){
    setCart(prev=>{
      const idx = prev.findIndex(x=>x.id===product.id)
      if(idx>-1){
        const next = [...prev]; next[idx] = {...next[idx], qty: next[idx].qty+1}; return next
      }
      return [...prev, {...product, qty:1}]
    })
  }

  function handleRemove(productId){ setCart(prev => prev.filter(p=>p.id!==productId)) }
  function handleChangeQty(productId, qty){ setCart(prev=> prev.map(p=> p.id===productId? {...p, qty} : p)) }

  function exportCSV(){
    const rows = filtered.map(p=> ({ id: p.id, title: p.title, category: p.category, price: p.price }))
    const header = Object.keys(rows[0] || {id:'',title:'',category:'',price:''})
    const csv = [header.join(','), ...rows.map(r => header.map(h => `"${String(r[h]).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'products.csv'
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  return (
    <div className="product-page">
      <header className="topbar">
        <div className="brand">Product List</div>
        <div className="controls">
          <input aria-label="search" className="search" placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="category" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="export" onClick={exportCSV} aria-label="Export visible products to CSV" title="Export CSV">📥 Export</button>
        </div>
        <Cart items={cart} onRemove={handleRemove} onChangeQty={handleChangeQty} aria-live="polite" />
      </header>

      <main>
        <div className="summary">Showing <strong>{filtered.length}</strong> products</div>
        <div className="grid">
          {filtered.map(product=> (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} onOpen={p=>setSelected(p)} />
          ))}
        </div>
      </main>

      {selected && (
        <ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={handleAdd} />
      )}

    </div>
  )
}