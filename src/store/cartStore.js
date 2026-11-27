// cartStore.js — Shopping cart store with Zustand and manual localStorage persistence
import { create } from 'zustand';

const CART_STORAGE_KEY = 'fitzone_cart';

/**
 * Load initial cart items from localStorage safely
 */
function getStoredCartItems() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
  }
  return [];
}

/**
 * Zustand Shopping Cart Store
 */
export const useCartStore = create((set, get) => ({
  // Array of { product, quantity }
  items: getStoredCartItems(),

  /**
   * Add a product to the cart. If already present, increment quantity.
   */
  addItem: (product) => {
    if (!product || product.id == null) return;

    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => String(item.product?.id) === String(product.id)
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return { items: updated };
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    });
  },

  /**
   * Remove an item from the cart by its product ID
   */
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(
        (item) => String(item.product?.id) !== String(productId)
      ),
    }));
  },

  /**
   * Update quantity of an item. If qty <= 0, remove the item.
   */
  updateQuantity: (productId, qty) => {
    const numericQty = Number(qty);
    if (numericQty <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        String(item.product?.id) === String(productId)
          ? { ...item, quantity: numericQty }
          : item
      ),
    }));
  },

  /**
   * Remove all items from cart
   */
  clearCart: () => {
    set({ items: [] });
  },

  /**
   * Calculate total price of all items in cart
   */
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      const price = Number(item.product?.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + price * quantity;
    }, 0);
  },

  /**
   * Calculate total count of all individual items in cart
   */
  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  },
}));

// Manual persistence using Zustand's subscribe method
if (typeof window !== 'undefined') {
  useCartStore.subscribe((state) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.error('Error persisting cart to localStorage:', err);
    }
  });
}

export default useCartStore;
