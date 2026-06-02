"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <motion.div
        className={`flex items-center bg-white border-2 rounded-full overflow-hidden transition-shadow ${
          focused ? "border-blue-950 shadow-lg shadow-blue-950/10" : "border-gray-200"
        }`}
        animate={focused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          className="w-5 h-5 ml-4 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Rechercher un maillot, un club, une ligue..."
          className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
        />
        {query && (
          <button
            type="submit"
            className="mr-2 px-5 py-1.5 bg-blue-950 text-white text-sm font-bold rounded-full hover:bg-blue-900 transition-colors"
          >
            Rechercher
          </button>
        )}
      </motion.div>
    </form>
  )
}