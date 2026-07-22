import React from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import useProducts from '../../hooks/useProducts';

function ProductsPage() {
  const { data: products, loading, error } = useProducts();

  return (
    <section>
      <ProductGrid products={products} loading={loading} error={error} />
    </section>
  );
}

export default ProductsPage;
