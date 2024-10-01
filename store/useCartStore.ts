import { Insert, Row } from "@/types/supabase/table";
import { create } from "zustand";

export type CartItem = Partial<Insert<"orderItems">>;

type CartState = {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (item: Row<"products">) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  getCartItem: (productId: string) => CartItem | null;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
};

const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  addToCart: (product) => {
    const existingItem = get().cart.find((i) => i.productId === product.id);

    if (existingItem) {
      get().increaseQuantity(product.id);
      return;
    }

    const item: CartItem = {
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
      unit: product.unit,
      description: product.description,
    };
    set((state) => ({ cart: [...state.cart, item] }));
  },
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.productId !== productId),
    })),
  increaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: (item.quantity ?? 0) + 1 }
          : item
      ),
    })),
  decreaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max((item.quantity ?? 0) - 1, 0) }
            : item
        )
        .filter((item) => (item.quantity ?? 0) > 0), // Remove item if quantity becomes 0
    })),
  getCartItem: (productId) =>
    get().cart.find((item) => item.productId === productId) ?? null,
  getTotalPrice: () =>
    get().cart.reduce(
      (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
      0
    ),
  getTotalQuantity: () =>
    get().cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
