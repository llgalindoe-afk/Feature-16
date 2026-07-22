import api from './axios';

export const getWishlist = async () => {
  const response = await api.get('/api/wishlist');
  return response.data;
};

export const toggleWishlistApi = async (productId) => {
  const response = await api.post(`/api/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/api/wishlist/${productId}`);
  return response.data;
};
