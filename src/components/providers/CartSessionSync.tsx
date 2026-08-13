"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useCartStore, cartOwnerId } from "@/store/cartStore"

export function CartSessionSync() {
  const { data: session, status } = useSession()
  const switchOwner = useCartStore((s) => s.switchOwner)
  const syncedOwner = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (status === "loading") return

    const userId = session?.user?.id ?? null
    const ownerKey = cartOwnerId(userId)

    if (syncedOwner.current === ownerKey) return

    syncedOwner.current = ownerKey
    switchOwner(userId)
  }, [session?.user?.id, status, switchOwner])

  return null
}
