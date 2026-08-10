import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token from sessionStorage if present (cross-site fallback)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath = error.config.url.includes('/api/auth/profile') || error.config.url.includes('/api/auth/login');
      
      if (!isAuthPath) {
        // Clear cross-site fallback token
        sessionStorage.removeItem('token');
        
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
