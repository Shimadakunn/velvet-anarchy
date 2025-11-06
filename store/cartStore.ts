import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VariantType } from "@/lib/type";
import { trackAddToCart, trackRemoveFromCart, trackCartQuantityUpdate } from "@/lib/analytics";

export type CartItem = {
  id: string; // Unique identifier for this cart item (productId + variants combination)
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string; // Storage ID
  price: number;
  variants: Record<VariantType, string>; // e.g., { color: "Blue", size: "S" }
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id"> & { quantity?: number; openCart?: boolean }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

// Helper function to generate unique cart item ID
const generateCartItemId = (
  productId: string,
  variants: Record<VariantType, string>
): string => {
  const variantString = Object.entries(variants)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
  return `${productId}-${variantString}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { quantity = 1, openCart = true, ...itemData } = item;
        const id = generateCartItemId(itemData.productId, itemData.variants);
        const existingItem = get().items.find((i) => i.id === id);

        if (existingItem) {
          // If item exists, add the new quantity to existing quantity
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          // Add new item with specified quantity
          set({
            items: [...get().items, { ...itemData, id, quantity }],
          });
        }

        // Track add to cart event
        trackAddToCart({
          productId: itemData.productId,
          productName: itemData.productName,
          price: itemData.price,
          quantity: quantity,
          variants: itemData.variants,
        });

        // Open cart when item is added (if openCart is true)
        if (openCart) {
          set({ isOpen: true });
        }
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        
        if (item) {
          // Track remove from cart event
          trackRemoveFromCart(item);
        }

        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const item = get().items.find((i) => i.id === id);
        
        if (item && item.quantity !== quantity) {
          // Track quantity update
          trackCartQuantityUpdate({
            productId: item.productId,
            productName: item.productName,
            oldQuantity: item.quantity,
            newQuantity: quantity,
            price: item.price,
          });
        }

        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
