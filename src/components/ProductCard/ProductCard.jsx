import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from '../WishlistButton/WishlistButton';

function ProductCard({ product }) {
  const getImageUrl = (prod) => {
    const url = prod.imageUrl || prod.image;
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:3000/${url}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/products/${product.id}`} className="product-card product-card-link">
        <img src={getImageUrl(product)} alt={product.name} className="product-image" />
        <div className="product-body">
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <strong>{product.price.toFixed(2)} €</strong>
            <span className="text-link">Ver producto</span>
          </div>
        </div>
      </Link>
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
        <WishlistButton product={product} />
      </div>
    </div>
  );
}

export default ProductCard;
