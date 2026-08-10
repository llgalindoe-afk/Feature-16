import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkoutThunk } from '../../store/cartSlice';

function CheckoutSuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart in the database and Redux store upon successful checkout
    dispatch(checkoutThunk());
  }, [dispatch]);

  return (
    <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="panel auth-card" style={{ maxWidth: '500px', width: '100%', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', animation: 'scaleUp 0.5s ease-out' }}>✓</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Pago completado</h1>
        <p className="lead" style={{ color: 'var(--color-black-60)', marginBottom: '2rem' }}>Gracias por tu compra</p>
        <style>{`
          @keyframes scaleUp {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;
