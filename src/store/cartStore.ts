import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FlocageOptions } from "@/types/product"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  image: string
  flocage?: FlocageOptions
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, flocageKey?: string) => void
  updateQty: (id: string, size: string, qty: number, flocageKey?: string) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
}

export function flocageKey(f?: FlocageOptions): string {
  if (!f) return ""
  return `${f.nom}|${f.numero}|${f.nomEnBas}`
}

function itemKey(id: string, size: string, flocage?: FlocageOptions) {
  return `${id}::${size}::${flocageKey(flocage)}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.id, item.size, item.flocage)
          const exists = state.items.find(
            (i) => itemKey(i.id, i.size, i.flocage) === key
          )

          if (exists) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.size, i.flocage) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }

          return { items: [...state.items, item] }
        }),

      removeItem: (id, size, flocageKeyStr = "") =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.id, i.size, i.flocage) !== `${id}::${size}::${flocageKeyStr}`
          ),
        })),

      updateQty: (id, size, qty, flocageKeyStr = "") =>
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.id, i.size, i.flocage) === `${id}::${size}::${flocageKeyStr}`
              ? { ...i, quantity: qty }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "elite-cart" }
  )
)
