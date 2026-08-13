"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/cartStore"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

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
  const { data: session, status } = useSession()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* Top banner annonce */}
      <div className="bg-blue-950 text-white text-xs text-center py-2 font-bold tracking-wider">
        LIVRAISON OFFERTE DES 80 EUR | -50% SUR UNE LARGE SELECTION
      </div>

      {/* Notification de connexion réussie */}
      <AnimatePresence>
        {session && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            Ravi de vous revoir, {session.user?.name || "Supporteir"} ! Connecté avec succès.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-black text-blue-950 tracking-tight">
              ELITE<span className="text-red-600">FOOTBALL</span>SHOP
            </span>
          </Link>

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

          {/* Right actions (Compte + Panier) */}
          <div className="flex items-center gap-3">
            {/* Statut Utilisateur / Connexion */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    className="w-8 h-8 rounded-full border border-blue-950 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center text-xs font-bold">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-black text-blue-950 leading-tight line-clamp-1 max-w-[120px]">
                    {session.user?.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    ● Connecté
                  </span>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="ml-1 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  title="Déconnexion"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-bold bg-blue-950 text-white px-3 py-2 rounded-lg hover:bg-blue-900 transition-colors shrink-0"
              >
                Connexion / S'inscrire
              </Link>
            )}

            {/* Bouton Panier */}
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