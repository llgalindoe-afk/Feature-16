import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath = error.config.url.includes('/api/auth/profile') || error.config.url.includes('/api/auth/login');
      
      if (!isAuthPath) {
        // Dispatch logout dynamically to avoid circular dependencies
        try {
          const { default: store } = await import('../store');
          const { logout } = await import('../store/authSlice');
          store.dispatch(logout());
        } catch (err) {
          console.error('Error dispatching logout from axios interceptor:', err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
