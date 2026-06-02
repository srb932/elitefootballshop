"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const LIGUES = ["Toutes", "Ligue 1", "Premier League", "La Liga", "Serie A", "Bundesliga"]
const CLUBS = ["Tous", "PSG", "OM", "OL", "AS Monaco", "Real Madrid", "Barcelona", "Man City", "Bayern"]
const TAILLES = ["Toutes", "S", "M", "L", "XL", "XXL"]
const TRIS = [
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix decroissant", value: "price-desc" },
  { label: "Nouveautes", value: "newest" },
  { label: "Promotions", value: "sales" },
]

export function FilterBar({ onFilter }: { onFilter?: (filters: Record<string, string>) => void }) {
  const [filters, setFilters] = useState({
    ligue: "Toutes",
    club: "Tous",
    taille: "Toutes",
    tri: "newest",
  })

  const updateFilter = (key: string, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    onFilter?.(updated)
  }

  const selectClasses =
    "px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 cursor-pointer outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-colors"

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xs font-black text-gray-500 uppercase tracking-wider mr-1">
        Filtrer
      </span>

      <select
        value={filters.ligue}
        onChange={(e) => updateFilter("ligue", e.target.value)}
        className={selectClasses}
      >
        {LIGUES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        value={filters.club}
        onChange={(e) => updateFilter("club", e.target.value)}
        className={selectClasses}
      >
        {CLUBS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={filters.taille}
        onChange={(e) => updateFilter("taille", e.target.value)}
        className={selectClasses}
      >
        {TAILLES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <span className="text-xs font-black text-gray-500 uppercase tracking-wider mr-1">
        Trier
      </span>

      <select
        value={filters.tri}
        onChange={(e) => updateFilter("tri", e.target.value)}
        className={selectClasses}
      >
        {TRIS.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <button
        onClick={() => {
          const reset = { ligue: "Toutes", club: "Tous", taille: "Toutes", tri: "newest" }
          setFilters(reset)
          onFilter?.(reset)
        }}
        className="ml-auto px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        Reinitialiser
      </button>
    </motion.div>
  )
}