"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { Maillot } from "@/types/product"
import { SIZES } from "@/types/product"
import { useCartStore } from "@/store/cartStore"
import { PromoBanner } from "@/components/catalog/PromoBanner"
import { BrandMark } from "@/components/layout/BrandMark"

type ViewSide = "front" | "back"

export function ProductDetail({ product }: { product: Maillot }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addItem = useCartStore((s) => s.addItem)

  const returnUrl = searchParams.get("return") || "/"

  const [side, setSide] = useState<ViewSide>("front")
  const [size, setSize] = useState<string>("")
  const [nom, setNom] = useState("")
  const [numero, setNumero] = useState("")
  const [nomEnBas, setNomEnBas] = useState("")
  const [error, setError] = useState<string | null>(null)

  const currentImage = side === "front" ? product.imageFront : product.imageBack

  const handleAddToCart = () => {
    if (!size) {
      setError("Veuillez sélectionner une taille.")
      return
    }
    setError(null)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size,
      image: product.imageFront,
      flocage: { nom, numero, nomEnBas },
    })

    const separator = returnUrl.includes("?") ? "&" : "?"
    router.push(`${returnUrl}${separator}added=1`)
  }

  return (
    <div className="min-h-screen bg-[#edf4ff] antialiased text-gray-900 font-[family-name:var(--font-inter)]">
      <PromoBanner />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 hover:opacity-80">
            <BrandMark size="sm" />
          </Link>
          <Link href={returnUrl} className="text-sm font-medium text-blue-950 hover:text-gray-700">
            ← Retour au catalogue
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="relative bg-gray-50 h-80 md:h-[28rem] rounded-xl mb-4 overflow-hidden">
              <Image
                src={currentImage}
                alt={`${product.name} ${side === "front" ? "avant" : "arrière"}`}
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                priority
                className="object-contain p-6"
              />
            </div>

            <div className="flex gap-3 justify-center">
              {(["front", "back"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`flex-1 max-w-[140px] border rounded-xl p-2 transition-all ${
                    side === s ? "border-blue-950 ring-2 ring-blue-950/20" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="relative h-20 bg-gray-50 rounded-lg mb-1 overflow-hidden">
                    <Image
                      src={s === "front" ? product.imageFront : product.imageBack}
                      alt={s === "front" ? "Avant" : "Arrière"}
                      fill
                      sizes="140px"
                      className="object-contain p-2"
                    />
                  </div>
                  <span className="text-[10px] font-semibold uppercase text-gray-600">
                    {s === "front" ? "Avant" : "Arrière"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase">{product.league} · {product.club}</p>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mt-1">{product.name}</h1>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
              {product.section === "promo" && (
                <span className="text-sm text-gray-400 line-through">{product.oldPrice.toFixed(2)} €</span>
              )}
            </div>
            {product.section === "promo" && (
              <span className="mt-2 inline-block w-fit rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold uppercase text-red-700">
                Promo d&apos;ouverture
              </span>
            )}

            <div className="mt-8">
              <label className="text-xs font-semibold uppercase text-gray-700 block mb-3">Taille *</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] px-4 py-2.5 text-sm font-semibold border rounded-lg transition-colors ${
                      size === s
                        ? "bg-blue-950 text-white border-blue-950"
                        : "bg-white text-gray-800 border-gray-200 hover:border-blue-950"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xs font-semibold uppercase text-gray-700 border-b border-gray-100 pb-2">
                Flocage (optionnel)
              </h2>
              {[
                { label: "Nom (dos)", key: "nom" as const, value: nom, set: setNom, placeholder: "MBAPPÉ" },
                { label: "Numéro", key: "numero" as const, value: numero, set: (v: string) => setNumero(v.replace(/\D/g, "").slice(0, 2)), placeholder: "7" },
                { label: "Nom en bas", key: "nomEnBas" as const, value: nomEnBas, set: setNomEnBas, placeholder: "PARIS" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-medium uppercase text-gray-500 block mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value.toUpperCase())}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium uppercase bg-gray-50 focus:outline-none focus:border-blue-950"
                  />
                </div>
              ))}
            </div>

            {error && <p className="mt-4 text-red-600 text-xs font-medium">{error}</p>}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-xl bg-blue-950 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-colors hover:bg-blue-800"
            >
              Ajouter au panier — {product.price.toFixed(2)} €
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
