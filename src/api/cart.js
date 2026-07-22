import api from './axios';

export const getCart = async () => {
  const response = await api.get('/api/cart');
  return response.data;
};

export const addToCart = async (cartItem) => {
  const response = await api.post('/api/cart/items', cartItem);
  return response.data;
};

export const removeFromCart = async (id) => {
  const response = await api.delete(`/api/cart/items/${id}`);
  return response.data;
};

export const checkoutCart = async () => {
  const response = await api.post('/api/cart/checkout');
  return response.data;
};
