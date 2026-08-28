"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { CartSessionSync } from "@/components/providers/CartSessionSync"
import { SupportChat } from "@/components/support/SupportChat"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <CartSessionSync />
      {children}
      <SupportChat />
    </NextAuthSessionProvider>
  )
}
