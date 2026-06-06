"use client"

import { useState } from "react"
import Image from "next/image"
import { useCartStore, flocageKey, type CartItem } from "@/store/cartStore"
import { EMPTY_SHIPPING, type ShippingInfo } from "@/types/product"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-shadow"

export function CartView({
  onBack,
  discount,
  onApplyPromo,
  promoCode,
  setPromoCode,
}: {
  onBack: () => void
  discount: number
  onApplyPromo: () => void
  promoCode: string
  setPromoCode: (v: string) => void
}) {
  const { items, removeItem, updateQty } = useCartStore()
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = Math.max(0, subtotal - discount)

  const updateShipping = (key: keyof ShippingInfo, value: string) => {
    setShipping((prev) => ({ ...prev, [key]: value }))
  }

  const validateForm = (): string | null => {
    if (!shipping.nom.trim()) return "Le nom est requis."
    if (!shipping.prenom.trim()) return "Le prénom est requis."
    if (!shipping.email.trim() || !shipping.email.includes("@")) return "Email invalide."
    if (!shipping.telephone.trim()) return "Le téléphone est requis."
    if (!shipping.adresse.trim()) return "L'adresse est requise."
    if (!shipping.numero.trim()) return "Le numéro de rue est requis."
    if (!shipping.codePostal.trim()) return "Le code postal est requis."
    if (!shipping.ville.trim()) return "La ville est requise."
    return null
  }

  const handleCheckout = async () => {
    const formError = validateForm()
    if (formError) {
      setError(formError)
      return
    }
    if (items.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping, discount }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du paiement.")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("URL de paiement introuvable.")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Votre panier est vide</p>
        <button type="button" onClick={onBack} className="mt-4 text-sm font-medium text-blue-950 hover:underline">
          Continuer mes achats
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button type="button" onClick={onBack} className="text-sm text-blue-950 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        ← Continuer mes achats
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                {items.reduce((s, i) => s + i.quantity, 0)} article{items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
              </h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {items.map((item: CartItem) => {
                const key = flocageKey(item.flocage)
                return (
                  <li key={`${item.id}-${item.size}-${key}`} className="px-5 py-4 flex gap-4">
                    <div className="relative w-16 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Taille {item.size}
                        {item.flocage?.nom && ` · ${item.flocage.nom}`}
                        {item.flocage?.numero && ` · n°${item.flocage.numero}`}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.size, Math.max(1, item.quantity - 1), key)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.size, item.quantity + 1, key)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.size, key)}
                            className="text-xs text-gray-400 hover:text-red-500"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">Code promo</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="BIENVENUE10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={onApplyPromo}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 shrink-0"
              >
                OK
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-xs mt-2">Réduction : −{discount.toFixed(2)} €</p>
            )}
          </div>

          <div className="bg-blue-950 text-white rounded-2xl p-5 flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-semibold">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Livraison + paiement */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Coordonnées & livraison</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom" required>
                <input className={inputClass} value={shipping.nom} onChange={(e) => updateShipping("nom", e.target.value)} />
              </Field>
              <Field label="Prénom" required>
                <input className={inputClass} value={shipping.prenom} onChange={(e) => updateShipping("prenom", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" required>
                <input type="email" className={inputClass} value={shipping.email} onChange={(e) => updateShipping("email", e.target.value)} />
              </Field>
              <Field label="Téléphone" required>
                <input type="tel" className={inputClass} value={shipping.telephone} onChange={(e) => updateShipping("telephone", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <Field label="N° rue" required>
                <input className={inputClass} value={shipping.numero} onChange={(e) => updateShipping("numero", e.target.value)} />
              </Field>
              <div className="col-span-2 sm:col-span-3">
                <Field label="Rue" required>
                  <input className={inputClass} value={shipping.adresse} onChange={(e) => updateShipping("adresse", e.target.value)} />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Bâtiment">
                <input className={inputClass} placeholder="A, B..." value={shipping.batiment} onChange={(e) => updateShipping("batiment", e.target.value)} />
              </Field>
              <Field label="Étage / Appartement">
                <input className={inputClass} placeholder="3ème, Appt 12..." value={shipping.etage} onChange={(e) => updateShipping("etage", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Code postal" required>
                <input className={inputClass} value={shipping.codePostal} onChange={(e) => updateShipping("codePostal", e.target.value)} />
              </Field>
              <Field label="Ville" required>
                <input className={inputClass} value={shipping.ville} onChange={(e) => updateShipping("ville", e.target.value)} />
              </Field>
              <Field label="Pays">
                <input className={inputClass} value={shipping.pays} onChange={(e) => updateShipping("pays", e.target.value)} />
              </Field>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-4">
                Paiement sécurisé par Stripe · Livraison gratuite dès 3 maillots
              </p>

              {error && (
                <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-950 hover:bg-blue-900 disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
              >
                {loading ? "Redirection vers Stripe..." : `Payer ${total.toFixed(2)} €`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
