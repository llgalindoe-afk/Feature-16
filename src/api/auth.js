import api from './axios';

export const login = async (data) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

export const getProfile = async (token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/api/auth/profile', { headers });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};
