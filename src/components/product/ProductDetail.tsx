"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Maillot } from "@/types/product"
import { SIZES } from "@/types/product"
import { useCartStore } from "@/store/cartStore"

type ViewSide = "front" | "back"

export function ProductDetail({ product }: { product: Maillot }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

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

    router.push("/?added=1")
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="text-xs font-black uppercase text-blue-950 hover:text-gray-700 tracking-wider"
            style={{ fontFamily: '"Arial Black", sans-serif' }}
          >
            ← Retour au catalogue
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galerie avant / arrière */}
          <div className="bg-white border-2 border-gray-200 rounded p-4">
            <div className="bg-[#f8f9fa] h-80 md:h-[28rem] flex items-center justify-center border-2 border-gray-100 rounded mb-4">
              <img
                src={currentImage}
                alt={`${product.name} ${side === "front" ? "avant" : "arrière"}`}
                className="h-full w-auto object-contain mix-blend-multiply"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setSide("front")}
                className={`flex-1 max-w-[140px] border-2 rounded p-2 transition-all ${
                  side === "front"
                    ? "border-blue-950 ring-2 ring-blue-950/20"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="h-20 flex items-center justify-center bg-[#f8f9fa] rounded mb-1">
                  <img src={product.imageFront} alt="Avant" className="h-full w-auto object-contain" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  Avant
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSide("back")}
                className={`flex-1 max-w-[140px] border-2 rounded p-2 transition-all ${
                  side === "back"
                    ? "border-blue-950 ring-2 ring-blue-950/20"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="h-20 flex items-center justify-center bg-[#f8f9fa] rounded mb-1">
                  <img src={product.imageBack} alt="Arrière" className="h-full w-auto object-contain" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-700" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  Arrière
                </span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white border-2 border-gray-200 rounded p-6 flex flex-col">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Arial Black", sans-serif' }}>
              {product.league}
            </p>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1 uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 mt-4" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
              <span className="text-3xl font-black text-gray-900 tracking-wide">{product.price.toFixed(2)} €</span>
              <span className="text-sm text-gray-400 line-through font-normal">{product.oldPrice.toFixed(2)} €</span>
            </div>

            {/* Taille */}
            <div className="mt-8">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-3" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                Taille *
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] px-4 py-2.5 text-sm font-black border-2 rounded transition-colors ${
                      size === s
                        ? "bg-blue-950 text-white border-blue-950"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-950"
                    }`}
                    style={{ fontFamily: '"Arial Black", sans-serif' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Flocage */}
            <div className="mt-8 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b-2 border-gray-200 pb-2" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                Flocage personnalisé (optionnel)
              </h2>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Nom (dos)</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value.toUpperCase())}
                  placeholder="Ex: MBAPPÉ"
                  maxLength={15}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-bold uppercase bg-gray-50 focus:outline-none focus:border-blue-950"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Numéro</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder="Ex: 7"
                  maxLength={2}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-bold bg-gray-50 focus:outline-none focus:border-blue-950"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Nom en bas</label>
                <input
                  type="text"
                  value={nomEnBas}
                  onChange={(e) => setNomEnBas(e.target.value.toUpperCase())}
                  placeholder="Ex: PARIS"
                  maxLength={20}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm font-bold uppercase bg-gray-50 focus:outline-none focus:border-blue-950"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-600 text-xs font-bold">{error}</p>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full bg-blue-950 hover:bg-gray-900 text-white text-sm font-black uppercase py-4 rounded transition-colors tracking-widest shadow-sm"
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
