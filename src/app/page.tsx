"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SearchBar } from "../components/search/SearchBar"
import { useCartStore, flocageKey } from "../store/cartStore"
import { MOCK_MAILLOTS, searchProducts } from "../lib/products"
import { LEAGUE_OPTIONS } from "../lib/clubs"

export default function CatalogPage() {
  const [selectedLeague, setSelectedLeague] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")
  const { items: cart } = useCartStore()

  const [view, setView] = useState<"catalog" | "cart">("catalog")
  const [notification, setNotification] = useState<string | null>(null)

  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("added") === "1") {
      setNotification("⚡ MAILLOT AJOUTÉ AU PANIER !")
      setTimeout(() => setNotification(null), 3000)
      window.history.replaceState({}, "", "/")
    }
  }, [])

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "FOOT2026") {
      setDiscount(10)
    } else {
      setDiscount(0)
    }
  }

  const filteredProducts = searchProducts(MOCK_MAILLOTS, searchQuery, selectedLeague)

  const totalPure = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalFinal = Math.max(0, totalPure - discount)

  const leagueEmoji: Record<string, string> = {
    Tous: "🌍",
    "Ligue 1": "🇫🇷",
    "Ligue 2": "🇫🇷",
    "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "La Liga": "🇪🇸",
    "Serie A": "🇮🇹",
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="bg-black text-white text-xs font-black py-2.5 text-center uppercase tracking-widest px-4 border-b border-gray-800" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
        ⚡ LIVRAISON GRATUITE DÈS 2 MAILLOTS ACHETÉS — CODE: FOOT2026 ⚡
      </div>

      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => setView("catalog")}>
            <span className="text-2xl md:text-3xl font-black tracking-wide text-blue-950 uppercase italic leading-none" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              L&apos;ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase mt-1">
              • LE REPAIRE DU SUPPORTER •
            </span>
          </div>

          <div
            className={`p-2.5 rounded-full relative cursor-pointer transition border-2 ${view === "cart" ? "bg-blue-950 text-white border-blue-950" : "bg-gray-100 hover:bg-gray-200 border-transparent"}`}
            onClick={() => setView("cart")}
          >
            🛒{" "}
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full"
              style={{ fontFamily: '"Arial Black", sans-serif' }}
            >
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
        </div>
      </header>

      {view === "catalog" && (
        <>
          <div className="max-w-7xl mx-auto px-4 mt-6 space-y-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={setSearchQuery} />

            <div className="bg-white p-4 rounded border-2 border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  Choisir un championnat :
                </label>
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="bg-[#f4f6f9] border-2 border-gray-300 rounded px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-800 focus:outline-none focus:border-blue-950 cursor-pointer"
                  style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                >
                  {LEAGUE_OPTIONS.map((league) => (
                    <option key={league} value={league}>
                      {league === "Tous" ? "🌍 Tous les championnats" : `${leagueEmoji[league] ?? ""} ${league}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-gray-500 font-black tracking-wide uppercase" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                {filteredProducts.length} ARTICLES DISPONIBLES
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 py-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded p-8 text-center text-sm font-bold text-gray-500">
                Aucun maillot trouvé. Essayez un autre mot-clé ou championnat.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((maillot) => (
                  <Link
                    key={maillot.id}
                    href={`/product/${maillot.id}`}
                    className="bg-white border-2 border-gray-200 rounded overflow-hidden hover:shadow-xl hover:border-blue-950 transition-all flex flex-col group relative"
                  >
                    {maillot.badge && (
                      <span
                        className={`absolute top-2 left-2 z-10 text-[10px] font-black uppercase text-white px-2 py-1 rounded ${maillot.badge === "PROMO" ? "bg-red-600" : "bg-green-600"}`}
                        style={{ fontFamily: '"Arial Black", sans-serif' }}
                      >
                        {maillot.badge}
                      </span>
                    )}

                    <div className="bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center border-b-2 border-gray-100 p-4 relative overflow-hidden">
                      <img
                        src={maillot.imageFront}
                        alt={`${maillot.name} avant`}
                        className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-0 z-10 mix-blend-multiply"
                      />
                      <img
                        src={maillot.imageBack}
                        alt={`${maillot.name} arrière`}
                        className="absolute h-[calc(100%-2rem)] w-auto object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20 mix-blend-multiply"
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                          {maillot.league}
                        </p>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 leading-snug group-hover:text-blue-950 transition-colors">
                          {maillot.name}
                        </h3>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-baseline gap-2 mb-2" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                          <span className="text-xl font-black text-gray-900 tracking-wide">{maillot.price.toFixed(2)} €</span>
                          <span className="text-xs text-gray-400 line-through font-normal tracking-wide">{maillot.oldPrice.toFixed(2)} €</span>
                        </div>
                        <span
                          className="block w-full text-center bg-blue-950 group-hover:bg-gray-900 text-white text-xs font-black uppercase py-3 rounded transition-colors tracking-widest shadow-sm"
                          style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                        >
                          VOIR LE MAILLOT
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {view === "cart" && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setView("catalog")}
            className="mb-6 text-xs font-black uppercase text-blue-950 hover:text-gray-800 tracking-wider"
            style={{ fontFamily: '"Arial Black", sans-serif' }}
          >
            ← Continuer mes achats
          </button>

          <h2 className="text-2xl font-black italic uppercase tracking-wide border-b-2 border-gray-300 pb-2 mb-6" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
            VOTRE PANIER & COMMANDE
          </h2>

          {cart.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 p-8 text-center font-bold text-gray-500 rounded">
              Votre panier est vide pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white border-2 border-gray-200 p-4 rounded">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-3 border-b pb-1" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                    Articles
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.size}-${flocageKey(item.flocage)}`}
                        className="flex flex-col bg-gray-50 p-2 border rounded text-xs font-bold gap-1"
                      >
                        <div className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="text-gray-900">{item.price.toFixed(2)} €</span>
                        </div>
                        <span className="text-gray-500 font-normal">
                          Taille : {item.size}
                          {item.flocage?.nom && ` • Nom : ${item.flocage.nom}`}
                          {item.flocage?.numero && ` • N°${item.flocage.numero}`}
                          {item.flocage?.nomEnBas && ` • Bas : ${item.flocage.nomEnBas}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 p-4 rounded">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-2" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                    Code Promo
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: FOOT2026"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-2 border-gray-300 rounded px-3 py-2 text-xs font-bold uppercase w-full bg-gray-50 focus:outline-none focus:border-blue-950"
                    />
                    <button onClick={applyPromo} className="bg-black text-white text-xs font-black uppercase px-4 py-2 rounded" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                      Appliquer
                    </button>
                  </div>
                  {discount > 0 && <p className="text-green-600 text-[11px] font-bold mt-1">✓ Réduction de {discount}€ appliquée !</p>}
                </div>

                <div className="bg-blue-950 text-white p-4 rounded flex justify-between items-center font-black" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                  <span className="tracking-wide">TOTAL À PAYER :</span>
                  <span className="text-xl tracking-wide text-white">{totalFinal.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 p-4 rounded space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 border-b pb-1" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  Informations de livraison
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Nom</label>
                    <input type="text" required className="w-full border-2 border-gray-300 rounded px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-950 bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Prénom</label>
                    <input type="text" required className="w-full border-2 border-gray-300 rounded px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-950 bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Adresse Complète</label>
                  <input type="text" required placeholder="N°, rue, appartement..." className="w-full border-2 border-gray-300 rounded px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-blue-950 bg-gray-50" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Moyen de paiement</label>
                  <select className="w-full bg-gray-50 border-2 border-gray-300 rounded px-2.5 py-2 text-xs font-black uppercase tracking-wider text-gray-800 focus:outline-none focus:border-blue-950 cursor-pointer" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                    <option value="cb">💳 Carte Bancaire (Visa, Mastercard)</option>
                    <option value="paypal">🅿️ PayPal</option>
                    <option value="apple">🍏 Apple Pay</option>
                  </select>
                </div>

                <button
                  onClick={() => alert("Commande simulée avec succès !")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-3.5 rounded transition-colors tracking-widest shadow-md mt-2"
                  style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                >
                  VALIDER ET PAYER {totalFinal.toFixed(2)} €
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white px-5 py-3 rounded border border-gray-800 shadow-2xl animate-bounce text-xs font-black tracking-widest uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
          {notification}
        </div>
      )}

      <footer className="bg-white border-t-2 border-gray-200 mt-12 py-6 text-center text-xs text-gray-600 font-bold uppercase tracking-wider" style={{ fontFamily: '"Arial Black", sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-2">
          <div>🔒 PAIEMENT 100% SÉCURISÉ</div>
          <div>✈️ LIVRAISON SUIVIE</div>
          <div>💬 SUPPORT CLIENT 7J/7</div>
        </div>
      </footer>
    </div>
  )
}
