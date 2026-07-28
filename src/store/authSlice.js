import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi, getProfile as getProfileApi } from '../api/auth';

// Helper to get initial state from localStorage safely
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token') || null;
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      token,
      user,
      loading: false,
      error: null,
    };
  } catch {
    return {
      token: null,
      user: null,
      loading: false,
      error: null,
    };
  }
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      const token = data.token || data.accessToken || null;
      
      if (!token) {
        throw new Error('El servidor no devolvió un token de acceso.');
      }
      
      // Save token in localStorage temporarily so that axios interceptors can read it for getProfile call
      localStorage.setItem('token', token);
      
      // Fetch user profile using the token
      const profileResponse = await getProfileApi();
      const user = profileResponse.data || profileResponse;
      
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Error al iniciar sesión';
      return rejectWithValue(message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Error al registrarse';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
