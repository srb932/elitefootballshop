"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "../src/components/cards/ProductCard" // Vérifie si ton ProductCard est bien ici

// 1. On crée une fausse liste de maillots pour tester l'affichage en attendant ta base de données
const DUMMY_PRODUCTS = [
  { id: "1", name: "Maillot Real Madrid Domicile", price: 89.99, league: "LaLiga", club: "Real Madrid", image: "/images/real.jpg", description: "Le maillot mythique de la Casa Blanca pour la nouvelle saison." },
  { id: "2", name: "Maillot PSG Extérieur", price: 89.99, league: "Ligue 1", club: "PSG", image: "/images/psg.jpg", description: "Le nouveau maillot extérieur du club de la capitale." },
  { id: "3", name: "Maillot Arsenal Domicile", price: 85.00, league: "Premier League", club: "Arsenal", image: "/images/arsenal.jpg", description: "Style rétro et épuré pour les Gunners cette année." },
  { id: "4", name: "Maillot Barcelone Domicile", price: 89.99, league: "LaLiga", club: "FC Barcelone", image: "/images/barca.jpg", description: "Les rayures blaugrana classiques avec une coupe moderne." },
]

export default function CatalogPage() {
  // États pour gérer les filtres sélectionnés par l'utilisateur
  const [selectedLeague, setSelectedLeague] = useState("Tous")
  const [selectedClub, setSelectedClub] = useState("Tous")

  // Filtrage dynamique de la liste
  const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
    const matchLeague = selectedLeague === "Tous" || product.league === selectedLeague
    const matchClub = selectedClub === "Tous" || product.club === selectedClub
    return matchLeague && matchClub
  })

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* --- EN-TÊTE DU SITE --- */}
      <header className="bg-black text-white py-12 text-center border-b-4 border-amber-500">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-wider text-amber-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          L'ÂME DU MAILLOT
        </motion.h1>
        <p className="text-gray-400 mt-2 max-w-md mx-auto px-4 text-sm md:text-base">
          Trouvez les maillots les plus iconiques des plus grands clubs et championnats. La passion du football à fleur de peau.
        </p>
      </header>

      {/* --- SECTION DES FILTRES (MENU DÉROULANT) --- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filtre Championnat */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-500 mb-1">Championnat</label>
              <select 
                value={selectedLeague} 
                onChange={(e) => { setSelectedLeague(e.target.value); setSelectedClub("Tous"); }}
                className="border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Tous">Tous les championnats</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="LaLiga">LaLiga</option>
                <option value="Premier League">Premier League</option>
              </select>
            </div>

            {/* Filtre Club (S'adapte selon le championnat choisi) */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-500 mb-1">Club</label>
              <select 
                value={selectedClub} 
                onChange={(e) => setSelectedClub(e.target.value)}
                className="border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Tous">Tous les clubs</option>
                {selectedLeague === "Ligue 1" && <option value="PSG">PSG</option>}
                {selectedLeague === "LaLiga" && (
                  <>
                    <option value="Real Madrid">Real Madrid</option>
                    <option value="FC Barcelone">FC Barcelone</option>
                  </>
                )}
                {selectedLeague === "Premier League" && <option value="Arsenal">Arsenal</option>}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            {filteredProducts.length} maillot(s) trouvé(s)
          </div>
        </div>

        {/* --- GRILLE DES MAILLOTS --- */}
        <main className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun maillot ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between"
                >
                  {/* Image Temporaire (tu mettras tes vraies images après) */}
                  <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-bold relative">
                    [ Image {product.club} ]
                  </div>
                  
                  {/* Infos Produit */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {product.league}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900 mt-2">{product.name}</h2>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-extrabold text-black">{product.price.toFixed(2)} €</span>
                      <button className="bg-black text-white hover:bg-amber-500 hover:text-black transition-colors px-4 py-2 rounded text-sm font-bold uppercase">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}