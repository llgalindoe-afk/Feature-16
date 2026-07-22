import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch logout dynamically to avoid circular dependencies
      try {
        const { default: store } = await import('../store');
        const { logout } = await import('../store/authSlice');
        store.dispatch(logout());
      } catch (err) {
        console.error('Error dispatching logout from axios interceptor:', err);
      }
      
      // Force redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
