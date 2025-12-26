import React from 'react'
import './ProductCard.css'

export default function ProductCard({ product, onAdd, onOpen }) {
  function handleOpen(e){
    if(onOpen) onOpen(product)
  }

  function onKeyOpen(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }

  return (
    <div className="product-card" aria-label={`${product.title} card`}>
      <div className="image-wrap" role="button" tabIndex={0} onClick={handleOpen} onKeyDown={onKeyOpen} aria-label={`View details for ${product.title}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
        <div className="view-overlay" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title" role="button" tabIndex={0} onClick={handleOpen} onKeyDown={onKeyOpen}>{product.title}</h3>
        <div className="product-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <button className="add-btn" onClick={() => onAdd(product)} aria-label={`Add ${product.title} to cart`}>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}