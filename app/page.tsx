"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Fausse liste de maillots style Maxikit pour tester le rendu
const MOCK_MAILLOTS = [
  { id: "1", name: "Maillot Real Madrid Domicile 2026", price: 45.00, oldPrice: 90.00, league: "Liga", club: "Real Madrid", badge: "Populaire" },
  { id: "2", name: "Maillot France Euro 2024", price: 45.00, oldPrice: 85.00, league: "Équipes Nationales", club: "France", badge: "Promo" },
  { id: "3", name: "Maillot Arsenal Domicile 2025/2026", price: 45.00, oldPrice: 90.00, league: "Premier League", club: "Arsenal", badge: "" },
  { id: "4", name: "Maillot PSG Domicile 2026", price: 45.00, oldPrice: 90.00, league: "Ligue 1", club: "PSG", badge: "Nouveau" },
]

export default function CatalogPage() {
  const [selectedLeague, setSelectedLeague] = useState("Tous")

  const filteredProducts = MOCK_MAILLOTS.filter((product) => {
    return selectedLeague === "Tous" || product.league === selectedLeague
  })

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans antialiased text-gray-900">
      
      {/* BANDEAU FLASH INFO (Style Maxikit : Promo / Livraison) */}
      <div className="bg-red-600 text-white text-xs font-bold py-2 text-center uppercase tracking-wide px-4">
        ⚡ LIVRAISON GRATUITE DÈS 2 MAILLOTS ACHETÉS — CODE: FOOT2026 ⚡
      </div>

      {/* --- EN-TÊTE PRINCIPALE --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* NOM DE LA MARQUE */}
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black tracking-tight text-blue-900 uppercase">
              L'ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase -mt-1">
              Le repaire du supporter
            </span>
          </div>

          {/* PETIT PANIER RAPIDE */}
          <div className="bg-gray-100 p-2.5 rounded-full relative cursor-pointer hover:bg-gray-200 transition">
            🛒 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>
        </div>
      </header>

      {/* --- ZONE DE FILTRES PAR CHAMPIONNAT (Boutons Horizontaux Dynamiques) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["Tous", "Ligue 1", "Liga", "Premier League", "Équipes Nationales"].map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-4 py-2 text-sm font-bold uppercase rounded-md whitespace-nowrap transition-all border ${
                selectedLeague === league
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {league}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENU DE LA BOUTIQUE --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* TITRE DE LA CATÉGORIE ACCUEIL */}
        <div className="border-b-2 border-gray-200 pb-3 mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-gray-800">
            {selectedLeague === "Tous" ? "Tous les maillots" : selectedLeague}
          </h2>
          <span className="text-xs text-gray-500 font-bold bg-gray-200 px-2 py-1 rounded">
            {filteredProducts.length} ARTICLES
          </span>
        </div>

        {/* --- GRILLE DE PRODUITS STYLE MAXIKIT --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((maillot) => (
            <div 
              key={maillot.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all flex flex-col group relative"
            >
              {/* Badge Promo / Populaire */}
              {maillot.badge && (
                <span className={`absolute top-2 left-2 z-10 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded ${
                  maillot.badge === "Promo" ? "bg-red-500" : "bg-green-500"
                }`}>
                  {maillot.badge}
                </span>
              )}

              {/* IMAGE DU MAILLOT */}
              <div className="bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center border-b border-gray-100 group-hover:scale-105 transition-transform duration-300">
                <span className="text-gray-400 font-mono text-xs font-bold">[ IMAGE {maillot.club} ]</span>
              </div>

              {/* INFOS PRODUIT */}
              <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{maillot.league}</p>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-0.5 group-hover:text-blue-900 transition-colors">
                    {maillot.name}
                  </h3>
                </div>

                {/* PRIX ET BOUTON D'ACHAT */}
                <div className="mt-3">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-black text-red-600">{maillot.price.toFixed(2)} €</span>
                    <span className="text-xs text-gray-400 line-through">{maillot.oldPrice.toFixed(2)} €</span>
                  </div>

                  <button className="w-full bg-blue-900 hover:bg-blue-950 text-white text-xs font-extrabold uppercase py-2.5 rounded transition-colors tracking-wider shadow-sm">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* REASSURANCE RAPIDE EN PIED DE PAGE */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-2">
          <div>🔒 Paiement 100% Sécurisé</div>
          <div>✈️ Livraison Suivie</div>
          <div>💬 Support Client 7j/7</div>
        </div>
      </footer>

    </div>
  )
}