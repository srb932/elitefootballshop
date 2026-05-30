import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  image: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQty: (id: string, size: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.id === item.id && i.size === item.size
          )

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }

          return { items: [...state.items, item] }
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size)
          ),
        })),

      updateQty: (id, size, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity: qty } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () =>
        set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "elite-cart" }
  )
)