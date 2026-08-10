import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi, getProfile as getProfileApi } from '../api/auth';

const getInitialState = () => {
  return {
    user: null,
    isInitialized: false,
    loading: false,
    error: null,
  };
};

export const checkSessionThunk = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const profileResponse = await getProfileApi(token);
      const user = profileResponse.data || profileResponse;
      return { user };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Error de sesión';
      return rejectWithValue(message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // 1. Post credentials (backend sets httpOnly cookie and returns token in JSON)
      const data = await loginApi(credentials);
      const token = data.token || null;
      
      if (token) {
        sessionStorage.setItem('token', token);
      }
      
      // 2. Fetch user profile (pass token explicitly as fallback in case cookies are blocked)
      const profileResponse = await getProfileApi(token);
      const user = profileResponse.data || profileResponse;
      return { user };
    } catch (error) {
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

export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, { rejectWithValue }) => {
    try {
      const { logout: logoutApi } = await import('../api/auth');
      await logoutApi();
      return true;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Error al cerrar sesión';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem('token');
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Session
      .addCase(checkSessionThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(checkSessionThunk.fulfilled, (state, action) => {
        state.isInitialized = true;
        state.user = action.payload.user;
      })
      .addCase(checkSessionThunk.rejected, (state) => {
        sessionStorage.removeItem('token');
        state.isInitialized = true;
        state.user = null;
      })
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        sessionStorage.removeItem('token');
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
      })
      // Logout Thunk
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        sessionStorage.removeItem('token');
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        sessionStorage.removeItem('token');
        state.loading = false;
        state.user = null;
        state.error = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export const selectIsAdmin = (state) => state.auth.user?.role?.toUpperCase() === 'ADMIN';
export default authSlice.reducer;
