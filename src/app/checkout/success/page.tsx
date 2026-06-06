"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCartStore } from "@/store/cartStore"

function SuccessContent() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    if (searchParams.get("session_id")) {
      clearCart()
    }
  }, [searchParams, clearCart])

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Commande confirmée</h1>
        <p className="text-sm text-gray-500 mb-6">
          Merci pour votre achat. Vous recevrez un email de confirmation. Livraison sous 2 semaines.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-950 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
