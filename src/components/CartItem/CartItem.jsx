import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemQty, removeCartItem } from '../../store/cartSlice';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { product, quantity, size, id } = item;

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(updateCartItemQty({ id, productId: product.id, quantity: quantity - 1, currentQuantity: quantity }));
    } else {
      dispatch(removeCartItem(id));
    }
  };

  const handleIncrease = () => {
    dispatch(updateCartItemQty({ id, productId: product.id, quantity: quantity + 1, currentQuantity: quantity }));
  };

  const handleRemove = () => {
    dispatch(removeCartItem(id));
  };

  const getImageUrl = (prod) => {
    const url = prod.imageUrl || prod.image;
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:3000/${url}`;
  };

  const itemTotal = (product.price * quantity).toFixed(2);

  return (
    <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', flexWrap: 'wrap' }}>
      <img 
        src={getImageUrl(product)} 
        alt={product.name} 
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} 
      />
      <div style={{ flex: 1, minWidth: '150px' }}>
        <p className="detail-label" style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'rgba(17, 17, 17, 0.5)' }}>{product.category}</p>
        <h4 style={{ margin: '0.2rem 0', fontSize: '1.1rem', fontWeight: '600' }}>{product.name}</h4>
        {size && <p className="detail-copy" style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(17, 17, 17, 0.7)' }}>Talla: <strong>{size}</strong></p>}
      </div>
      
      <div className="quantity-row" style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(17, 17, 17, 0.1)', borderRadius: '12px', padding: '0.2rem' }}>
        <button 
          type="button" 
          onClick={handleDecrease}
          style={{ background: 'transparent', border: 0, padding: '0.4rem 0.8rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          -
        </button>
        <span style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>{quantity}</span>
        <button 
          type="button" 
          onClick={handleIncrease}
          style={{ background: 'transparent', border: 0, padding: '0.4rem 0.8rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          +
        </button>
      </div>

      <div style={{ textAlign: 'right', minWidth: '100px' }}>
        <strong style={{ fontSize: '1.1rem', display: 'block' }}>{itemTotal} €</strong>
        <span style={{ fontSize: '0.85rem', color: 'rgba(17, 17, 17, 0.5)' }}>{product.price.toFixed(2)} €/ud</span>
      </div>

      <button 
        type="button" 
        onClick={handleRemove} 
        style={{ background: 'none', color: '#ef4444', fontWeight: '500', padding: '0.5rem', fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
      >
        Eliminar
      </button>
    </div>
  );
}

export default CartItem;
