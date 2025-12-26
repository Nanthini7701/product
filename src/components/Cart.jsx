import React, { useState, useEffect, useRef } from 'react'
import './Cart.css'

export default function Cart({ items=[], onRemove, onChangeQty }){
  const [open, setOpen] = useState(false)
  const total = items.reduce((s,i)=> s + i.price * i.qty, 0)
  const liveRef = useRef('')
  const prevCount = useRef(items.reduce((s,i)=>s+i.qty,0))
  const [liveMessage, setLiveMessage] = useState('')

  useEffect(()=>{
    const current = items.reduce((s,i)=>s+i.qty,0)
    let msg = ''
    if(current > prevCount.current){
      msg = `Added to cart. ${current} items in cart.`
    } else if(current < prevCount.current){
      msg = `Removed from cart. ${current} items in cart.`
    } else {
      msg = `Cart updated. ${current} items.`
    }
    prevCount.current = current
    if(msg){
      // schedule to avoid sync setState within effect (reduce lint warnings)
      const t = setTimeout(()=> setLiveMessage(msg), 0)
      return ()=> clearTimeout(t)
    }
  }, [items])

  useEffect(()=>{
    // briefly set and clear to ensure screen readers announce changes
    if(liveMessage){
      liveRef.current = liveMessage
      const t = setTimeout(()=>{ setLiveMessage('') }, 1200)
      return ()=> clearTimeout(t)
    }
  }, [liveMessage])

  return (
    <div className="cart-root">
      <button className="cart-btn" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Open cart">
        🛒 <span className="badge">{items.reduce((s,i)=>s+i.qty,0)}</span>
      </button>
      <div className="sr-only" aria-live="polite">{liveMessage}</div>
      {open && (
        <div className="cart-drop" role="dialog" aria-label="Shopping cart">
          <h4>Cart</h4>
          {!items.length && <div className="empty">Your cart is empty</div>}
          {items.map(item=> (
            <div key={item.id} className="cart-item">
              <div className="left">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="mid">
                <div className="title">{item.title}</div>
                <div className="controls">
                  <input aria-label={`Quantity for ${item.title}`} type="number" min="1" value={item.qty} onChange={e=>onChangeQty(item.id, Math.max(1, Number(e.target.value)||1))} />
                  <div className="price">${(item.price*item.qty).toFixed(2)}</div>
                </div>
              </div>
              <div className="right">
                <button className="remove" onClick={()=>onRemove(item.id)} aria-label={`Remove ${item.title} from cart`}>Remove</button>
              </div>
            </div>
          ))}
          {items.length>0 && (
            <div className="footer">
              <div>Total <strong>${total.toFixed(2)}</strong></div>
              <button className="checkout">Checkout</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}