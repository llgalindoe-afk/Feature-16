import api from './axios';

export const getReviews = async (productId) => {
  const response = await api.get(`/api/products/${productId}/reviews`);
  return response.data.data || response.data;
};

export const postReview = async (productId, reviewData) => {
  const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
  return response.data.data || response.data;
};
