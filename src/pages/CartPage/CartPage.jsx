import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart } from '../../store/cartSlice';
import CartItem from '../../components/CartItem/CartItem';
import CartSummary from '../../components/CartSummary/CartSummary';

function CartPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="panel loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner"></div>
        <p className="lead">Cargando tu carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel error-banner" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Error al cargar el carrito</h2>
        <p className="lead">{error}</p>
      </div>
    );
  }

  return (
    <section className="stack-xl">
      <div>
        <p className="eyebrow">Tu Compra</p>
        <h2>Cesta de la Compra</h2>
      </div>

      {items.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="lead">Tu cesta está vacía.</p>
          <p className="detail-copy">Explora nuestro catálogo para añadir algunos productos.</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/products" className="button-link" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Ver Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2rem' }}>
          <div className="stack-md" style={{ flex: '2 1 600px', display: 'grid', gap: '1rem' }}>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <CartSummary items={items} />
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;
