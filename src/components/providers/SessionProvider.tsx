"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { CartSessionSync } from "@/components/providers/CartSessionSync"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <CartSessionSync />
      {children}
    </NextAuthSessionProvider>
  )
}
