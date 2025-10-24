import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      
      addItem: (item, restaurant) => {
        const { items, restaurant: currentRestaurant } = get();
        
        // Clear cart if different restaurant
        if (currentRestaurant && currentRestaurant._id !== restaurant._id) {
          set({ items: [{ ...item, quantity: 1 }], restaurant });
          return;
        }
        
        const existingItem = items.find(i => i._id === item._id);
        if (existingItem) {
          set({
            items: items.map(i =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            )
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], restaurant });
        }
      },
      
      removeItem: (itemId) => {
        const items = get().items.filter(i => i._id !== itemId);
        set({ items, restaurant: items.length === 0 ? null : get().restaurant });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(i =>
            i._id === itemId ? { ...i, quantity } : i
          )
        });
      },
      
      clearCart: () => set({ items: [], restaurant: null }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
