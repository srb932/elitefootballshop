"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MOCK_MAILLOTS } from "../lib/products"
import { searchProducts } from "../lib/search"
import {
  buildCatalogUrl,
  getClubName,
  getProductsForClub,
  parseCatalogState,
} from "../lib/catalog"
import { SearchBar } from "../components/search/SearchBar"
import { LeagueNav } from "../components/catalog/LeagueNav"
import { ClubGrid } from "../components/catalog/ClubGrid"
import { ProductGrid } from "../components/catalog/ProductGrid"
import { HomeFeatured } from "../components/catalog/HomeFeatured"
import { CatalogBreadcrumb } from "../components/catalog/CatalogBreadcrumb"
import { PromoBanner } from "../components/catalog/PromoBanner"
import { AuthModal } from "../components/auth/AuthModal"
import { CartView } from "../components/cart/CartView"
import { useCartStore } from "../store/cartStore"
import { ClubLogo } from "../components/catalog/ClubLogo"

function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items: cart } = useCartStore()

  const { league, clubSlug } = parseCatalogState(searchParams)
  const [searchQuery, setSearchQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [view, setView] = useState<"catalog" | "cart">(
    searchParams.get("cart") === "1" ? "cart" : "catalog"
  )
  const [notification, setNotification] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const catalogUrl = buildCatalogUrl({ league, clubSlug })
  const clubName = clubSlug && league !== "Accueil" ? getClubName(league, clubSlug) : undefined

  useEffect(() => {
    if (searchParams.get("added") === "1") {
      setNotification("Maillot ajouté au panier")
      setTimeout(() => setNotification(null), 3000)
      router.replace(catalogUrl)
    }
  }, [searchParams, catalogUrl, router])

  const navigate = (nextLeague: string, nextClub: string | null = null) => {
    setSearchQuery("")
    router.push(buildCatalogUrl({ league: nextLeague, clubSlug: nextClub }))
  }

  const applyPromo = () => {
    const code = promoCode.toUpperCase()
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    if (code === "BIENVENUE10") {
      setDiscount(Math.round(subtotal * 0.1 * 100) / 100)
    } else if (code === "FOOT2026") {
      setDiscount(10)
    } else {
      setDiscount(0)
    }
  }

  const isHome = league === "Accueil" && !clubSlug && !searchQuery.trim()
  const clubProducts = clubSlug ? getProductsForClub(MOCK_MAILLOTS, clubSlug) : []
  const searchResults = searchQuery.trim()
    ? searchProducts(MOCK_MAILLOTS, searchQuery, league, clubSlug)
    : clubSlug
      ? clubProducts
      : []

  const goHome = () => {
    setView("catalog")
    setSearchQuery("")
    router.push("/")
  }

  const openCart = () => {
    setView("cart")
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] antialiased text-gray-900 font-[family-name:var(--font-inter)]">
      <PromoBanner />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button type="button" onClick={goHome} className="text-left shrink-0">
            <span className="text-xl md:text-2xl font-black text-blue-950 uppercase italic leading-none">
              L&apos;ÂME DU MAILLOT
            </span>
            <span className="text-[10px] text-gray-500 font-normal tracking-widest uppercase block mt-0.5">
              Le repaire du supporter
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-blue-950 hover:text-blue-950 transition-colors"
            >
              Connexion
            </button>

            <button
              type="button"
              onClick={openCart}
              className={`p-2.5 rounded-lg relative border transition-colors ${
                view === "cart" ? "bg-blue-950 text-white border-blue-950" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
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
            <LeagueNav selected={league} onSelect={(l) => navigate(l, null)} />
          </div>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <CatalogBreadcrumb
              league={league}
              clubName={clubName}
              onHomeClick={goHome}
              onLeagueClick={() => navigate(league, null)}
            />

            {searchQuery.trim() ? (
              <ProductGrid products={searchResults} returnUrl={catalogUrl} />
            ) : isHome ? (
              <HomeFeatured products={MOCK_MAILLOTS} returnUrl="/" />
            ) : clubSlug && clubName ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <ClubLogo slug={clubSlug} name={clubName} size={56} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{clubName}</h2>
                    <p className="text-sm text-gray-500">{clubProducts.length} maillot{clubProducts.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <ProductGrid products={clubProducts} returnUrl={catalogUrl} />
              </div>
            ) : league !== "Accueil" ? (
              <ClubGrid
                league={league}
                products={MOCK_MAILLOTS.filter((p) => p.league === league)}
                onSelectClub={(slug) => navigate(league, slug)}
              />
            ) : null}
          </main>
        </>
      )}

      {view === "cart" && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <CartView
            onBack={() => setView("catalog")}
            discount={discount}
            onApplyPromo={applyPromo}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
          />
        </main>
      )}

      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg">
          {notification}
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <footer className="bg-white border-t border-gray-100 mt-12 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>Paiement sécurisé Stripe</div>
          <div>Livraison suivie</div>
          <div>Support 7j/7</div>
        </div>
      </footer>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center text-sm text-gray-500">Chargement...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
