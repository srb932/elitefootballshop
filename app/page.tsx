"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const MOCK_MAILLOTS = [
  { id: "1", name: "MAILLOT REAL MADRID DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Liga", club: "Real Madrid", badge: "POPULAIRE" },
  { id: "2", name: "MAILLOT FRANCE EURO 2024", price: 45.00, oldPrice: 85.00, league: "Équipes Nationales", club: "France", badge: "PROMO" },
  { id: "3", name: "MAILLOT ARSENAL DOMICILE 2025/2026", price: 45.00, oldPrice: 90.00, league: "Premier League", club: "Arsenal", badge: "" },
  { id: "4", name: "MAILLOT PSG DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Ligue 1", club: "PSG", badge: "NOUVEAU" },
]

export default function CatalogPage() {
  const [selectedLeague, setSelectedLeague] = useState("Tous")

  const filteredProducts = MOCK_MAILLOTS.filter((product) => {
    return selectedLeague === "Tous" || product.league === selectedLeague
  })

  return (
    // On force une police sans-serif propre sur tout le site
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900 selection:bg-blue-950 selection:text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* BANDEAU FLASH INFO */}
      <div className="bg-red-600 text-white text-xs font-black py-2 text-center uppercase tracking-wider px-4" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
        ⚡ LIVRAISON GRATUITE DÈS 2 MAILLOTS ACHETÉS — CODE: FOOT2026 ⚡
      </div>

      {/* --- EN-TÊTE PRINCIPALE --- */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* NOM DE LA MARQUE STYLE LOGO DE SPORT */}
          <div className="flex flex-col cursor-pointer">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-blue-950 uppercase italic leading-none" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              L'ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase mt-1">
              • LE REPAIRE DU SUPPORTER •
            </span>
          </div>

          {/* PETIT PANIER RAPIDE */}
          <div className="bg-gray-100 p-2.5 rounded-full relative cursor-pointer hover:bg-gray-200 transition">
            🛒 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full" style={{ fontFamily: '"Arial Black", sans-serif' }}>0</span>
          </div>
        </div>
      </header>

      {/* --- ZONE DE FILTRES (Boutons Style Flocage) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["Tous", "Ligue 1", "Liga", "Premier League", "Équipes Nationales"].map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-4 py-2.5 text-xs font-black uppercase rounded transition-all border-2 tracking-wider ${
                selectedLeague === league
                  ? "bg-blue-950 text-white border-blue-950 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              {league}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENU DE LA BOUTIQUE --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* TITRE DE LA CATÉGORIE */}
        <div className="border-b-2 border-gray-300 pb-2 mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-800 italic" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
            {selectedLeague === "Tous" ? "TOUS LES MAILLOTS" : selectedLeague.toUpperCase()}
          </h2>
          <span className="text-xs text-white font-black bg-gray-800 px-2.5 py-1 rounded" style={{ fontFamily: '"Arial Black", sans-serif' }}>
            {filteredProducts.length} ARTICLES
          </span>
        </div>

        {/* --- GRILLE DE PRODUITS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((maillot) => (
            <div 
              key={maillot.id}
              className="bg-white border-2 border-gray-200 rounded overflow-hidden hover:shadow-xl hover:border-blue-950 transition-all flex flex-col group relative"
            >
              {/* Badge Promo / Populaire */}
              {maillot.badge && (
                <span className={`absolute top-2 left-2 z-10 text-[10px] font-black uppercase text-white px-2 py-1 rounded ${
                  maillot.badge === "PROMO" ? "bg-red-600" : "bg-green-600"
                }`} style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  {maillot.badge}
                </span>
              )}

              {/* IMAGE DU MAILLOT */}
              <div className="bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center border-b-2 border-gray-100 group-hover:scale-102 transition-transform duration-200">
                <span className="text-gray-400 font-black text-xs">[ IMAGE {maillot.club.toUpperCase()} ]</span>
              </div>

              {/* INFOS PRODUIT */}
              <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-wider" style={{ fontFamily: '"Arial Black", sans-serif' }}>{maillot.league}</p>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 leading-snug group-hover:text-blue-950 transition-colors">
                    {maillot.name}
                  </h3>
                </div>

                {/* PRIX ET BOUTON D'ACHAT */}
                <div className="mt-4">
                  <div className="flex items-baseline gap-2 mb-2" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                    <span className="text-xl font-black text-red-600">{maillot.price.toFixed(2)} €</span>
                    <span className="text-xs text-gray-400 line-through font-normal">{maillot.oldPrice.toFixed(2)} €</span>
                  </div>

                  <button className="w-full bg-blue-950 hover:bg-red-600 text-white text-xs font-black uppercase py-3 rounded transition-colors tracking-widest shadow-sm" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                    AJOUTER AU PANIER
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* REASSURANCE RAPIDE */}
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