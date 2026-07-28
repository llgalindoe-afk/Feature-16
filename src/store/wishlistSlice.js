import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlist, toggleWishlistApi } from '../api/wishlist';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const responseData = await getWishlist();
      const products = responseData.data || responseData || [];
      
      // Normalize to wrapper objects expected by UI
      const items = products.map(product => ({
        id: product.id,
        productId: product.id,
        product
      }));
      
      return items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al cargar favoritos');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async ({ productId, product }, { rejectWithValue }) => {
    try {
      const responseData = await toggleWishlistApi(productId);
      const inWishlist = responseData.data?.inWishlist;
      return { action: inWishlist ? 'add' : 'remove', productId, product };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al actualizar favoritos');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    productIds: [],
    loading: false,
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.productIds = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.productIds = action.payload.map(item => item.productId);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist
      .addCase(toggleWishlist.pending, () => {
        // Smooth local transition
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.action === 'remove') {
          state.items = state.items.filter(item => item.productId !== action.payload.productId);
          state.productIds = state.productIds.filter(id => id !== action.payload.productId);
        } else {
          const newItem = {
            id: action.payload.productId,
            productId: action.payload.productId,
            product: action.payload.product
          };
          state.items.push(newItem);
          state.productIds.push(action.payload.productId);
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
