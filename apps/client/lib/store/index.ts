import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { CartItem } from '@/types/cart';

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch {
    console.error('Failed to save cart to localStorage');
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: {
    cart: {
      items: loadCartFromStorage(),
    },
  },
});

store.subscribe(() => {
  saveCartToStorage(store.getState().cart.items);
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
