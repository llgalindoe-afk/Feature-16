import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../store/wishlistSlice';
import ProductCard from '../../components/ProductCard/ProductCard';

function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="panel loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="spinner"></div>
        <p className="lead">Cargando tus favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel error-banner" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Error al cargar favoritos</h2>
        <p className="lead">{error}</p>
      </div>
    );
  }

  return (
    <section className="stack-xl">
      <div>
        <p className="eyebrow">Tus Favoritos</p>
        <h2>Lista de Deseos</h2>
      </div>

      {items.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="lead">No tienes ningún producto en tu lista de deseos.</p>
          <p className="detail-copy">Explora la tienda y pulsa en el corazón para guardarlos aquí.</p>
        </div>
      ) : (
        <div className="product-grid compact-grid elegant-grid">
          {items.map((item) => {
            if (!item.product) return null;
            return <ProductCard key={item.id} product={item.product} />;
          })}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;
