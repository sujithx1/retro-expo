import { Store } from '@tanstack/react-store';
import { Product } from '@/api/retro-api';

export interface CartItem {
  product: Product;
  qty: number;
}

export interface StoreState {
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
}

export const retroStore = new Store<StoreState>({
  cart: [],
  wishlist: [],
});

// Actions
export const addToCart = (product: Product) => {
  retroStore.setState((state) => {
    const existingIndex = state.cart.findIndex((item) => item.product._id === product._id);
    const newCart = [...state.cart];
    if (existingIndex > -1) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        qty: newCart[existingIndex].qty + 1,
      };
    } else {
      newCart.push({ product, qty: 1 });
    }
    return {
      ...state,
      cart: newCart,
    };
  });
};

export const updateCartQty = (productId: string, delta: number) => {
  retroStore.setState((state) => {
    const newCart = state.cart
      .map((item) => {
        if (item.product._id === productId) {
          const nextQty = item.qty + delta;
          return { ...item, qty: nextQty };
        }
        return item;
      })
      .filter((item) => item.qty > 0);
    return {
      ...state,
      cart: newCart,
    };
  });
};

export const removeFromCart = (productId: string) => {
  retroStore.setState((state) => ({
    ...state,
    cart: state.cart.filter((item) => item.product._id !== productId),
  }));
};

export const clearCart = () => {
  retroStore.setState((state) => ({
    ...state,
    cart: [],
  }));
};

export const toggleWishlist = (productId: string) => {
  retroStore.setState((state) => {
    const isFav = state.wishlist.includes(productId);
    const newWishlist = isFav
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId];
    return {
      ...state,
      wishlist: newWishlist,
    };
  });
};
