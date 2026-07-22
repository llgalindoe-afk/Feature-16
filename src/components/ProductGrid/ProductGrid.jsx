import React, { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';

function ProductGrid({ products = [], loading = false, error = null }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const validProducts = Array.isArray(products) ? products : [];

  // Dynamically extract unique categories and add "Todos" at the start
  const categories = ["Todos", ...new Set(validProducts.map(p => p.category).filter(Boolean))];

  // Filter products based on selected category AND search query
  const filteredProducts = validProducts.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="stack-xl">
      <div className="panel collection-banner elegant-banner">
        <p className="eyebrow">Colección completa</p>
        <h2>Selección de temporada</h2>
        <p className="lead">Una vista más serena del catálogo, con protagonismo para la imagen y una lectura más limpia del producto.</p>
        
        {/* Buscador de productos */}
        <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '16px',
              border: '1px solid rgba(17, 17, 17, 0.1)',
              background: '#ffffff',
              width: '100%',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(17, 17, 17, 0.04)'
            }}
          />
        </div>

        <div className="toolbar-inline">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${selectedCategory === cat ? 'active-filter' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="panel loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p className="lead">Cargando catálogo de productos...</p>
        </div>
      )}

      {error && (
        <div className="panel error-banner" style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="lead">Error al cargar productos: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="product-grid compact-grid elegant-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p className="lead">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
