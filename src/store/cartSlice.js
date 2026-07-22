import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, removeFromCart, checkoutCart } from '../api/cart';
import { getProducts } from '../api/products';

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [cartData, productsData] = await Promise.all([
        getCart(),
        getProducts().catch(() => []) // Fallback in case products call fails
      ]);

      const cartItems = cartData.data?.items || cartData.items || [];
      const products = productsData.data || productsData || [];

      // Populate product details in cart items
      const items = cartItems.map(item => {
        const product = item.product || products.find(p => p.id === item.productId) || null;
        return { ...item, product };
      });
      return items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al cargar el carrito');
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity, product }, { rejectWithValue }) => {
    try {
      // Backend handles addition and merging automatically on POST /api/cart/items
      const responseData = await addToCart({ productId: parseInt(productId), quantity });
      const newItem = responseData.data || responseData;
      return { ...newItem, product };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al añadir al carrito');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (id, { rejectWithValue }) => {
    try {
      await removeFromCart(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al eliminar del carrito');
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateQty',
  async ({ id, productId, quantity, currentQuantity }, { rejectWithValue }) => {
    try {
      const diff = quantity - currentQuantity;
      const responseData = await addToCart({ productId: parseInt(productId), quantity: diff });
      const updatedItem = responseData.data || responseData;
      return { id, quantity: updatedItem.quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al actualizar la cantidad');
    }
  }
);

export const checkoutThunk = createAsyncThunk(
  'cart/checkout',
  async (_, { rejectWithValue }) => {
    try {
      await checkoutCart();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Error al realizar checkout');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          item => item.productId === action.payload.productId
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Qty
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      // Checkout
      .addCase(checkoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(checkoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
