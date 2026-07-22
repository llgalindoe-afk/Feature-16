import api from './axios';

export const getReviews = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const response = await api.get('/reviews', { params: { productId } });
      return response.data;
    }
    throw error;
  }
};
