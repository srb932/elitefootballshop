"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useCartStore } from "@/store/cartStore"

const NAV_LINKS = [
  { label: "Nouveautes", href: "#nouveautes" },
  { label: "Ligue 1", href: "#ligue1" },
  { label: "Premier League", href: "#premierleague" },
  { label: "La Liga", href: "#laliga" },
  { label: "Serie A", href: "#seriea" },
  { label: "Promos", href: "#promos" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items, toggleCart } = useCartStore()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-blue-950 text-white text-xs text-center py-2 font-bold tracking-wider">
        LIVRAISON OFFERTE DES 80 EUR | -50% SUR UNE LARGE SELECTION
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-black text-blue-950 tracking-tight">
              ELITE<span className="text-red-600">FOOTBALL</span>SHOP
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-blue-950 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-blue-950 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.nav
            className="lg:hidden pb-4 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-950 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  )
}