"use client"

import { useState } from "react"

// 1. ÉLARGISSEMENT DE LA BASE DE DONNÉES (Ligue 1, Liga, Premier League, Bundesliga, Serie A)
const MOCK_MAILLOTS = [
  // Ligue 1
  { id: "1", name: "MAILLOT PSG DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Ligue 1", club: "PSG", badge: "NOUVEAU" },
  { id: "2", name: "MAILLOT MARSEILLE DOMICILE 2026", price: 45.00, oldPrice: 85.00, league: "Ligue 1", club: "OM", badge: "" },
  { id: "3", name: "MAILLOT LYON DOMICILE 2026", price: 45.00, oldPrice: 85.00, league: "Ligue 1", club: "OL", badge: "" },
  { id: "4", name: "MAILLOT MONACO EXTÉRIEUR 2026", price: 45.00, oldPrice: 90.00, league: "Ligue 1", club: "Monaco", badge: "PROMO" },
  { id: "5", name: "MAILLOT LILLE DOMICILE 2026", price: 45.00, oldPrice: 85.00, league: "Ligue 1", club: "Lille", badge: "" },
  // LaLiga
  { id: "6", name: "MAILLOT REAL MADRID DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "LaLiga", club: "Real Madrid", badge: "POPULAIRE" },
  { id: "7", name: "MAILLOT FC BARCELONE DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "LaLiga", club: "FC Barcelone", badge: "PROMO" },
  { id: "8", name: "MAILLOT ATLETICO MADRID DOMICILE 2026", price: 45.00, oldPrice: 85.00, league: "LaLiga", club: "Atletico Madrid", badge: "" },
  // Premier League
  { id: "9", name: "MAILLOT ARSENAL DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Premier League", club: "Arsenal", badge: "" },
  { id: "10", name: "MAILLOT MANCHESTER CITY DOMICILE 2026", price: 45.00, oldPrice: 95.00, league: "Premier League", club: "Man City", badge: "POPULAIRE" },
  { id: "11", name: "MAILLOT LIVERPOOL DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Premier League", club: "Liverpool", badge: "" },
  { id: "12", name: "MAILLOT MANCHESTER UNITED EXTÉRIEUR 2026", price: 45.00, oldPrice: 85.00, league: "Premier League", club: "Man United", badge: "PROMO" },
  // Bundesliga
  { id: "13", name: "MAILLOT BAYERN MUNICH DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Bundesliga", club: "Bayern Munich", badge: "" },
  { id: "14", name: "MAILLOT BORUSSIA DORTMUND DOMICILE 2026", price: 45.00, oldPrice: 85.00, league: "Bundesliga", club: "Dortmund", badge: "" },
  // Serie A
  { id: "15", name: "MAILLOT INTER MILAN DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Serie A", club: "Inter Milan", badge: "" },
  { id: "16", name: "MAILLOT JUVENTUS DOMICILE 2026", price: 45.00, oldPrice: 90.00, league: "Serie A", club: "Juventus", badge: "PROMO" },
]

export default function CatalogPage() {
  // État pour le filtre du menu déroulant
  const [selectedLeague, setSelectedLeague] = useState("Tous")
  
  // 2. ÉTAT DU PANIER (Stocke les maillots ajoutés)
  const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([])

  // Fonction pour ajouter au panier
  const addToCart = (maillot: { id: string; name: string; price: number }) => {
    setCart((prevCart) => [...prevCart, maillot])
    alert(`🛒 ${maillot.name} ajouté au panier !`)
  }

  // Filtrage des maillots selon le menu déroulant
  const filteredProducts = MOCK_MAILLOTS.filter((product) => {
    return selectedLeague === "Tous" || product.league === selectedLeague
  })

  return (
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* BANDEAU FLASH INFO */}
      <div className="bg-black text-white text-xs font-black py-2.5 text-center uppercase tracking-widest px-4 border-b border-gray-800" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
        ⚡ LIVRAISON GRATUITE DÈS 2 MAILLOTS ACHETÉS — CODE: FOOT2026 ⚡
      </div>

      {/* --- EN-TÊTE PRINCIPALE --- */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="flex flex-col cursor-pointer">
            <span className="text-2xl md:text-3xl font-black tracking-wide text-blue-950 uppercase italic leading-none" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              L'ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase mt-1">
              • LE REPAIRE DU SUPPORTER •
            </span>
          </div>

          {/* COMPTEUR DE PANIER DYNAMIQUE */}
          <div className="bg-gray-100 p-2.5 rounded-full relative cursor-pointer hover:bg-gray-200 transition" onClick={() => alert(`Votre panier contient ${cart.length} maillot(s).`)}>
            🛒 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full" style={{ fontFamily: '"Arial Black", sans-serif' }}>
              {cart.length}
            </span>
          </div>
        </div>
      </header>

      {/* --- ZONE DE FILTRE : MENU DÉROULANT (STYLE PRO) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white p-4 rounded border-2 border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-gray-700" style={{ fontFamily: '"Arial Black", sans-serif' }}>
              Choisir un championnat :
            </label>
            
            {/* LE MENU DÉROULANT DEMANDÉ */}
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-[#f4f6f9] border-2 border-gray-300 rounded px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-800 focus:outline-none focus:border-blue-950 cursor-pointer"
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              <option value="Tous">🌍 Tous les championnats</option>
              <option value="Ligue 1">🇫🇷 Ligue 1</option>
              <option value="LaLiga">🇪🇸 LaLiga</option>
              <option value="Premier League">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</option>
              <option value="Bundesliga">🇩🇪 Bundesliga</option>
              <option value="Serie A">🇮🇹 Serie A</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 font-black tracking-wide uppercase" style={{ fontFamily: '"Arial Black", sans-serif' }}>
            {filteredProducts.length} ARTICLES DISPONIBLES
          </div>
        </div>
      </div>

      {/* --- CONTENU DE LA BOUTIQUE --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        <div className="border-b-2 border-gray-300 pb-2 mb-6">
          <h2 className="text-xl md:text-2xl font-black tracking-wide text-gray-800 italic" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
            {selectedLeague === "Tous" ? "TOUS LES MAILLOTS DISPONIBLES" : selectedLeague.toUpperCase()}
          </h2>
        </div>

        {/* --- GRILLE DE PRODUITS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((maillot) => (
            <div 
              key={maillot.id}
              className="bg-white border-2 border-gray-200 rounded overflow-hidden hover:shadow-xl hover:border-blue-950 transition-all flex flex-col group relative"
            >
              {maillot.badge && (
                <span className={`absolute top-2 left-2 z-10 text-[10px] font-black uppercase text-white px-2 py-1 rounded ${
                  maillot.badge === "PROMO" ? "bg-red-600" : "bg-green-600"
                }`} style={{ fontFamily: '"Arial Black", sans-serif' }}>
                  {maillot.badge}
                </span>
              )}

              {/* IMAGE */}
              <div className="bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center border-b-2 border-gray-100 group-hover:scale-102 transition-transform duration-200">
                <span className="text-gray-400 font-black text-xs tracking-wider">[ IMAGE {maillot.club.toUpperCase()} ]</span>
              </div>

              {/* INFOS */}
              <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-wider" style={{ fontFamily: '"Arial Black", sans-serif' }}>{maillot.league}</p>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 leading-snug group-hover:text-blue-950 transition-colors">
                    {maillot.name}
                  </h3>
                </div>

                {/* PRIX ET ACTION */}
                <div className="mt-4">
                  <div className="flex items-baseline gap-2 mb-2" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
                    <span className="text-xl font-black text-red-600 tracking-wide">{maillot.price.toFixed(2)} €</span>
                    <span className="text-xs text-gray-400 line-through font-normal tracking-wide">{maillot.oldPrice.toFixed(2)} €</span>
                  </div>

                  {/* BOUTON AVEC ACTION CLIC CONNECTÉE */}
                  <button 
                    onClick={() => addToCart(maillot)}
                    className="w-full bg-blue-950 hover:bg-red-600 text-white text-xs font-black uppercase py-3 rounded transition-colors tracking-widest shadow-sm" 
                    style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                  >
                    AJOUTER AU PANIER
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* PIED DE PAGE */}
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