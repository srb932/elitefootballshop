"use client"

import { useState, useEffect } from "react"
import { MOCK_MAILLOTS } from "../lib/products"
import { searchProducts } from "../lib/search"
import { SearchBar } from "../components/search/SearchBar"
import { useCartStore, flocageKey } from "../store/cartStore"
import { LeagueNav } from "../components/catalog/LeagueNav"
import { ProductGrid } from "../components/catalog/ProductGrid"
import { HomeFeatured } from "../components/catalog/HomeFeatured"
import { AuthModal } from "../components/auth/AuthModal"

export default function CatalogPage() {
  const [selectedLeague, setSelectedLeague] = useState("Accueil")
  const [searchQuery, setSearchQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const { items: cart } = useCartStore()

  const [view, setView] = useState<"catalog" | "cart">("catalog")
  const [notification, setNotification] = useState<string | null>(null)

  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("added") === "1") {
      setNotification("Maillot ajouté au panier")
      setTimeout(() => setNotification(null), 3000)
      window.history.replaceState({}, "", "/")
    }
  }, [])

  const applyPromo = () => {
    setDiscount(promoCode.toUpperCase() === "FOOT2026" ? 10 : 0)
  }

  const isHome = selectedLeague === "Accueil" && !searchQuery.trim()
  const searchResults = searchQuery.trim()
    ? searchProducts(MOCK_MAILLOTS, searchQuery, selectedLeague)
    : selectedLeague === "Accueil"
      ? []
      : searchProducts(MOCK_MAILLOTS, "", selectedLeague)

  const totalPure = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalFinal = Math.max(0, totalPure - discount)

  const goHome = () => {
    setView("catalog")
    setSelectedLeague("Accueil")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900">
      <div className="bg-black text-white text-xs font-bold py-2 text-center uppercase tracking-widest px-4">
        Livraison gratuite dès 2 maillots — code FOOT2026
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button type="button" onClick={goHome} className="text-left shrink-0">
            <span className="text-xl md:text-2xl font-black text-blue-950 uppercase italic leading-none">
              L&apos;ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase block mt-0.5">
              Le repaire du supporter
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="px-3 py-2 text-xs font-bold uppercase text-gray-700 border border-gray-300 rounded-md hover:border-blue-950 hover:text-blue-950 transition-colors"
            >
              Connexion
            </button>

            <button
              type="button"
              onClick={() => setView("cart")}
              className={`p-2 rounded-md relative border transition-colors ${
                view === "cart" ? "bg-blue-950 text-white border-blue-950" : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
              aria-label="Panier"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.reduce((s, i) => s + i.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {view === "catalog" && (
        <>
          <div className="max-w-7xl mx-auto px-4 mt-6 space-y-5">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={setSearchQuery} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <LeagueNav selected={selectedLeague} onSelect={setSelectedLeague} />
              {!isHome && (
                <p className="text-xs text-gray-500 font-semibold uppercase shrink-0">
                  {searchResults.length} article{searchResults.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-6">
            {searchQuery.trim() ? (
              <ProductGrid products={searchResults} />
            ) : isHome ? (
              <HomeFeatured products={MOCK_MAILLOTS} />
            ) : (
              <ProductGrid products={searchResults} />
            )}
          </main>
        </>
      )}

      {view === "cart" && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button
            type="button"
            onClick={() => setView("catalog")}
            className="mb-6 text-xs font-bold uppercase text-blue-950 hover:text-gray-800"
          >
            ← Continuer mes achats
          </button>

          <h2 className="text-2xl font-black uppercase border-b border-gray-300 pb-2 mb-6">
            Votre panier
          </h2>

          {cart.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg">
              Votre panier est vide pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-sm font-bold uppercase text-gray-800 mb-3 border-b pb-2">Articles</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.size}-${flocageKey(item.flocage)}`}
                        className="flex flex-col bg-gray-50 p-2 border rounded text-xs gap-1"
                      >
                        <div className="flex justify-between font-bold">
                          <span>{item.name}</span>
                          <span className="text-gray-900">{item.price.toFixed(2)} €</span>
                        </div>
                        <span className="text-gray-500">
                          Taille {item.size}
                          {item.flocage?.nom && ` · ${item.flocage.nom}`}
                          {item.flocage?.numero && ` · n°${item.flocage.numero}`}
                          {item.flocage?.nomEnBas && ` · ${item.flocage.nomEnBas}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-sm font-bold uppercase mb-2">Code promo</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="FOOT2026"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-xs font-bold uppercase w-full bg-gray-50 focus:outline-none focus:border-blue-950"
                    />
                    <button type="button" onClick={applyPromo} className="bg-black text-white text-xs font-bold uppercase px-4 py-2 rounded-md">
                      Appliquer
                    </button>
                  </div>
                  {discount > 0 && <p className="text-green-600 text-xs font-medium mt-1">Réduction de {discount} € appliquée</p>}
                </div>

                <div className="bg-blue-950 text-white p-4 rounded-lg flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-xl">{totalFinal.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
                <h3 className="text-sm font-bold uppercase border-b pb-2">Livraison</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Nom" className="border border-gray-300 rounded-md px-2.5 py-2 text-xs bg-gray-50" />
                  <input type="text" placeholder="Prénom" className="border border-gray-300 rounded-md px-2.5 py-2 text-xs bg-gray-50" />
                </div>
                <input type="text" placeholder="Adresse complète" className="w-full border border-gray-300 rounded-md px-2.5 py-2 text-xs bg-gray-50" />
                <select className="w-full border border-gray-300 rounded-md px-2.5 py-2 text-xs bg-gray-50">
                  <option>Carte bancaire</option>
                  <option>PayPal</option>
                </select>
                <button
                  type="button"
                  onClick={() => alert("Commande simulée avec succès")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase py-3 rounded-md"
                >
                  Valider — {totalFinal.toFixed(2)} €
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white px-4 py-2 rounded-md text-xs font-bold shadow-lg">
          {notification}
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-2 font-semibold uppercase">
          <div>Paiement sécurisé</div>
          <div>Livraison suivie</div>
          <div>Support 7j/7</div>
        </div>
      </footer>
    </div>
  )
}
