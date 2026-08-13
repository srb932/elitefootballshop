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

export const GUEST_CART_OWNER = "__guest__"

export function cartOwnerId(userId?: string | null): string {
  return userId ?? GUEST_CART_OWNER
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  activeOwner: string
  cartsByOwner: Record<string, CartItem[]>
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, flocageKey?: string) => void
  updateQty: (id: string, size: string, qty: number, flocageKey?: string) => void
  clearCart: () => void
  toggleCart: () => void
  switchOwner: (userId: string | null) => void
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
      activeOwner: GUEST_CART_OWNER,
      cartsByOwner: { [GUEST_CART_OWNER]: [] },

      switchOwner: (userId) => {
        const nextOwner = cartOwnerId(userId)
        const { activeOwner, items, cartsByOwner } = get()

        if (nextOwner === activeOwner) return

        const updatedCarts = {
          ...cartsByOwner,
          [activeOwner]: items,
        }

        set({
          activeOwner: nextOwner,
          cartsByOwner: updatedCarts,
          items: updatedCarts[nextOwner] ?? [],
        })
      },

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.id, item.size, item.flocage)
          const exists = state.items.find(
            (i) => itemKey(i.id, i.size, i.flocage) === key
          )

          const nextItems = exists
            ? state.items.map((i) =>
                itemKey(i.id, i.size, i.flocage) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...state.items, item]

          return {
            items: nextItems,
            cartsByOwner: {
              ...state.cartsByOwner,
              [state.activeOwner]: nextItems,
            },
          }
        }),

      removeItem: (id, size, flocageKeyStr = "") =>
        set((state) => {
          const nextItems = state.items.filter(
            (i) => itemKey(i.id, i.size, i.flocage) !== `${id}::${size}::${flocageKeyStr}`
          )

          return {
            items: nextItems,
            cartsByOwner: {
              ...state.cartsByOwner,
              [state.activeOwner]: nextItems,
            },
          }
        }),

      updateQty: (id, size, qty, flocageKeyStr = "") =>
        set((state) => {
          const nextItems = state.items.map((i) =>
            itemKey(i.id, i.size, i.flocage) === `${id}::${size}::${flocageKeyStr}`
              ? { ...i, quantity: qty }
              : i
          )

          return {
            items: nextItems,
            cartsByOwner: {
              ...state.cartsByOwner,
              [state.activeOwner]: nextItems,
            },
          }
        }),

      clearCart: () =>
        set((state) => ({
          items: [],
          cartsByOwner: {
            ...state.cartsByOwner,
            [state.activeOwner]: [],
          },
        })),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: "elite-cart",
      partialize: (state) => ({
        isOpen: state.isOpen,
        cartsByOwner: state.cartsByOwner,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<CartStore> | undefined

        if (!saved) return current

        // Migration depuis l'ancien format (panier unique partagé)
        if (!saved.cartsByOwner && (saved as { items?: CartItem[] }).items) {
          const legacyItems = (saved as { items: CartItem[] }).items
          const cartsByOwner = { [GUEST_CART_OWNER]: legacyItems }

          return {
            ...current,
            isOpen: saved.isOpen ?? false,
            activeOwner: GUEST_CART_OWNER,
            cartsByOwner,
            items: legacyItems,
          }
        }

        const cartsByOwner = saved.cartsByOwner ?? { [GUEST_CART_OWNER]: [] }

        return {
          ...current,
          isOpen: saved.isOpen ?? false,
          activeOwner: GUEST_CART_OWNER,
          cartsByOwner,
          items: cartsByOwner[GUEST_CART_OWNER] ?? [],
        }
      },
    }
  )
)
