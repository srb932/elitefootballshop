"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore, cartOwnerId } from "@/store/cartStore"

export function CartSessionSync() {
  const { data: session, status } = useSession()
  const switchOwner = useCartStore((s) => s.switchOwner)
  const items = useCartStore((s) => s.items)
  const syncedOwner = useRef<string | undefined>(undefined)
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading") return

    const userId = session?.user?.id ?? null
    const ownerKey = cartOwnerId(userId)

    if (syncedOwner.current === ownerKey) return

    syncedOwner.current = ownerKey
    switchOwner(userId)
  }, [session?.user?.id, status, switchOwner])

  useEffect(() => {
    const sendPresence = () => { void fetch("/api/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: pathname }) }) }
    sendPresence(); const timer = window.setInterval(sendPresence, 120_000); return () => window.clearInterval(timer)
  }, [pathname])

  useEffect(() => {
    const key = "elite-cart-session"; let sessionId = localStorage.getItem(key)
    if (!sessionId) { sessionId = crypto.randomUUID(); localStorage.setItem(key, sessionId) }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const timer = window.setTimeout(() => { void fetch("/api/carts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, items, total }) }) }, 800)
    return () => window.clearTimeout(timer)
  }, [items, session?.user?.id])

  return null
}
