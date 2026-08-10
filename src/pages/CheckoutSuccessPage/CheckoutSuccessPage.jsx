import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkoutThunk } from '../../store/cartSlice';

function CheckoutSuccessPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart in the database and Redux store upon successful checkout redirect
    dispatch(checkoutThunk());
  }, [dispatch]);

  return (
    <div className="auth-container">
      <div className="panel auth-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }}>✓</div>
        <p className="eyebrow" style={{ color: '#10b981' }}>¡Pedido Realizado!</p>
        <h2>Compra Completada con Éxito</h2>
        <p className="lead">Muchas gracias por tu compra. Estamos procesando tu pedido y te enviaremos un correo electrónico de confirmación muy pronto.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/products" className="button-link" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;
