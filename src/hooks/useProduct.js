import { useState, useEffect } from 'react';
import { getProductById } from '../api/products';

export function useProduct(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const result = await getProductById(id);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Error al cargar el producto');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, loading, error };
}

export default useProduct;
