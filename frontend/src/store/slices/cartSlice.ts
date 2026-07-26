import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = { items: [], isOpen: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number; customization?: Record<string, string> }>) => {
      const { product, quantity, customization } = action.payload;
      const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
      const existing = state.items.find(i => i.product._id === product._id && JSON.stringify(i.customization) === JSON.stringify(customization));
      if (existing) { existing.quantity += quantity; }
      else { state.items.push({ product, quantity, customization, price }); }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; customization?: Record<string, string> }>) => {
      state.items = state.items.filter(i => !(i.product._id === action.payload.productId && JSON.stringify(i.customization) === JSON.stringify(action.payload.customization)));
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number; customization?: Record<string, string> }>) => {
      const item = state.items.find(i => i.product._id === action.payload.productId && JSON.stringify(i.customization) === JSON.stringify(action.payload.customization));
      if (item) {
        if (action.payload.quantity <= 0) state.items = state.items.filter(i => i !== item);
        else item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => { state.items = []; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    setCartOpen: (state, action: PayloadAction<boolean>) => { state.isOpen = action.payload; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, setCartOpen } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export default cartSlice.reducer;
