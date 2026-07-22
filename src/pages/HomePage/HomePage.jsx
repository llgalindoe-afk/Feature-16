import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard/ProductCard';

function HomePage() {
  const { data: products, loading, error } = useProducts();

  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <section className="stack-xl">
      <div className="panel sprint-hero">
        <div className="sprint-copy">
          <p className="eyebrow">Primavera / Verano</p>
          <h2>Nueva Colección de Temporada</h2>
          <p className="lead">
            Explora nuestra cuidada selección de prendas, calzado y accesorios minimalistas con un diseño contemporáneo y atemporal.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/products" className="button-link">
              Explorar Catálogo
            </Link>
          </div>
        </div>
        <div 
          className="sprint-side-note" 
          style={{ 
            background: 'linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.6)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80") center/cover no-repeat', 
            alignContent: 'end', 
            display: 'grid' 
          }}
        >
          <p className="spotlight-label">Destacado</p>
          <h3>Calidad en cada detalle</h3>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="panel">
        <p className="eyebrow">Destacados</p>
        <h2 style={{ margin: '0 0 1.5rem 0', letterSpacing: '-0.05em', fontSize: '2rem', textTransform: 'uppercase' }}>
          Productos Destacados
        </h2>
        
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="lead">Cargando productos destacados...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="product-grid compact-grid elegant-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="lead">No hay productos disponibles.</p>
            )}
          </div>
        )}
      </div>

      <div className="home-editorial-strip">
        <div className="editorial-card editorial-light">
          <p className="eyebrow">Filosofía</p>
          <h3>Diseño visual y funcional para el día a día.</h3>
        </div>
        <div className="editorial-card editorial-dark">
          <p className="eyebrow">Materiales</p>
          <h3>Lino ligero, algodón orgánico y acabados de calidad.</h3>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
