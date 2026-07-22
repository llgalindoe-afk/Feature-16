import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../../store/wishlistSlice';

function WishlistButton({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { productIds } = useSelector((state) => state.wishlist);

  const isFavorited = productIds.includes(product.id);

  const handleToggle = (e) => {
    e.preventDefault(); // Prevent navigating if this button is inside a Link card
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist({ productId: product.id, product }));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(17, 17, 17, 0.1)',
        transition: 'transform 0.15s ease, background-color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorited ? '#ef4444' : 'none'}
        stroke={isFavorited ? '#ef4444' : '#111111'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}

export default WishlistButton;
