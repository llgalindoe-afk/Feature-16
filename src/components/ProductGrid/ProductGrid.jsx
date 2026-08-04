import React, { useState, useMemo } from 'react';
import ProductCard from '../ProductCard/ProductCard';

function ProductGrid({ products = [], loading = false, error = null }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const validProducts = Array.isArray(products) ? products : [];

  // Dynamically extract unique categories and add "Todos" at the start
  const categories = useMemo(() => {
    return ["Todos", ...new Set(validProducts.map(p => p.category).filter(Boolean))];
  }, [validProducts]);

  // Filter and sort products based on selected category, search query and sortBy
  const filteredProducts = useMemo(() => {
    const filtered = validProducts.filter(product => {
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      return filtered.slice().sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return filtered.slice().sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name-asc") {
      return filtered.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    if (sortBy === "name-desc") {
      return filtered.slice().sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    return filtered;
  }, [validProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="stack-xl">
      <div className="panel collection-banner elegant-banner">
        <p className="eyebrow">Colección completa</p>
        <h2>Selección de temporada</h2>
        <p className="lead">Una vista más serena del catálogo, con protagonismo para la imagen y una lectura más limpia del producto.</p>
        
        {/* Buscador y Ordenación de productos */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '800px'
        }}>
          <div style={{ flex: '2', minWidth: '280px' }}>
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
          <div style={{ flex: '1', minWidth: '200px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '16px',
                border: '1px solid rgba(17, 17, 17, 0.1)',
                background: '#ffffff',
                width: '100%',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(17, 17, 17, 0.04)',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1.2rem center',
                backgroundSize: '1.2rem',
                paddingRight: '3rem'
              }}
            >
              <option value="default">Ordenar por: Destacados</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
              <option value="name-asc">Nombre: A - Z</option>
              <option value="name-desc">Nombre: Z - A</option>
            </select>
          </div>
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
