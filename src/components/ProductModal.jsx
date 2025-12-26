import React, { useEffect, useRef } from 'react'
import './ProductModal.css'

export default function ProductModal({ product, onClose, onAdd }){
  const closeRef = useRef(null)

  useEffect(()=>{ if(closeRef.current) closeRef.current.focus() }, [])

  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [onClose])

  if(!product) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="modal-card">
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close product details">✕</button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="modal-info">
            <h3 id="product-modal-title">{product.title}</h3>
            <p className="modal-category">{product.category}</p>
            <div className="modal-price">${product.price.toFixed(2)}</div>
            <p className="modal-description">This is a quick product description for <strong>{product.title}</strong>. You can expand this with more details, specifications, and features.</p>
            <div className="modal-actions">
              <button className="add-btn" onClick={() => { onAdd(product); onClose() }}>Add to Cart</button>
              <button className="secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}