import { useState, useEffect } from 'react';
import { getReviews } from '../api/reviews';

export function useReviews(productId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchReviews() {
      setLoading(true);
      setError(null);
      try {
        const result = await getReviews(productId);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Error al cargar las opiniones');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { data, loading, error };
}

export default useReviews;
