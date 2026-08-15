"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { AuthNav } from "../components/auth/AuthNav"
import { CartView } from "../components/cart/CartView"
import { useCartStore } from "../store/cartStore"
import { ClubLogo } from "../components/catalog/ClubLogo"

// =========================================================================
// COMPOSANT HERO IMMERSIF - VERSION ÉPURÉE (Plein Écran, Barre Cachée)
// =========================================================================
function HeroSection() {
  const images = [
    "/maillots/fond1.jpg",
    "/maillots/fond2.jpg",
    "/maillots/fond3.jpg"
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    // h-[calc(100vh-64px)] prend toute la hauteur restante sous le header pour masquer la recherche
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-zinc-950 mb-0">
      {/* Diaporama d'arrière-plan animé */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-50 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <img
            src={src}
            alt={`L'Âme du Maillot Fond ${index + 1}`}
            className="h-full w-full object-cover object-center"
            style={{ transform: index === currentIndex ? "scale(1.03)" : "scale(1)", transition: "transform 5000ms linear" }}
          />
        </div>
      ))}

      {/* Overlay dégradé sombre et élégant pour cacher le bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f4f6f9] via-black/30 to-black/60" />

      {/* Contenu textuel centré et épuré */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl uppercase italic leading-tight">
  PORTEZ{" "}
  <span className="inline-block px-3 py-1 -mx-3 -my-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-zinc-100 overflow-visible">
    L&apos;ÂME
  </span>{" "}
  DE VOTRE CLUB
</h1>
        
        <p className="mt-4 max-w-xl text-sm md:text-base text-zinc-300 font-light tracking-wide">
  Tous nos maillots en réduction pour fêter l&apos;ouverture officielle de la boutique.
</p>

        {/* Bouton d'action unique, sobre et professionnel */}
        <div className="mt-8 w-full max-w-xs sm:max-w-none flex justify-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("recherche-ancre");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-blue-950 rounded-lg hover:bg-black border border-blue-900/50 transition-all shadow-xl active:scale-95"
          >
            Découvrir les maillots
          </button>
        </div>

        {/* Indicateurs discrets en bas */}
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { items: cart } = useCartStore()

  const { league, clubSlug } = parseCatalogState(searchParams)
  const [searchQuery, setSearchQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [view, setView] = useState<"catalog" | "cart">(
    searchParams.get("cart") === "1" ? "cart" : "catalog"
  )
  const [notification, setNotification] = useState<string | null>(null)
  const [authSuccessType, setAuthSuccessType] = useState<"login" | "register" | null>(null)
  const [authBanner, setAuthBanner] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const catalogUrl = buildCatalogUrl({ league, clubSlug })
  const clubName = clubSlug && league !== "Accueil" ? getClubName(league, clubSlug) : undefined

  useEffect(() => {
    const authStatus = searchParams.get("auth")
    if (authStatus === "login" || authStatus === "register") {
      setAuthSuccessType(authStatus)
      router.replace("/")
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!authSuccessType) return
    const label = authSuccessType === "login" ? "Connexion réussie" : "Inscription réussie"
    setAuthBanner(`${label} ! Bienvenue${session?.user?.name ? `, ${session.user.name}` : ""}.`)
  }, [authSuccessType, session?.user?.name])

  useEffect(() => {
    if (!authBanner) return
    const timer = setTimeout(() => setAuthBanner(null), 5000)
    return () => clearTimeout(timer)
  }, [authBanner])

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

      {authBanner && (
        <div className="bg-blue-950 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide uppercase">
          {authBanner}
        </div>
      )}

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

          {/* Zone Contact / Connexion avec la police Inter, majuscules et espacement soigné */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-700 border border-gray-200 rounded-lg hover:border-blue-950 hover:text-blue-950 hover:bg-gray-50 transition-all duration-200"
            >
              Contact
            </Link>

            <AuthNav onLoginClick={() => setAuthOpen(true)} />

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
          {/* LE HERO S'AFFICHE UNIQUEMENT SUR L'ACCUEIL */}
          {isHome && <HeroSection />}

          <div id="recherche-ancre" className="max-w-7xl mx-auto px-4 mt-6 space-y-5">
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
              <ProductGrid products={searchResults} returnUrl={catalogUrl} showUnavailable={false} />
            ) : isHome ? (
              <div id="vedettes-ancre">
                <HomeFeatured products={MOCK_MAILLOTS} returnUrl="/" />
              </div>
            ) : clubSlug && clubName ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <ClubLogo slug={clubSlug} name={clubName} size={56} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{clubName}</h2>
                    <p className="text-sm text-gray-500">
                      {clubProducts.filter((p) => p.available).length} / {clubProducts.length} maillot
                      {clubProducts.length > 1 ? "s" : ""} disponible
                      {clubProducts.filter((p) => p.available).length !== 1 ? "s" : ""}
                    </p>
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

      <footer className="bg-white border-t border-gray-100 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center gap-4">
            <span>Paiement sécurisé Stripe</span>
            <span>Livraison suivie</span>
            <span>Support 7j/7</span>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-blue-950 transition-colors">
              Contact
            </Link>
            <Link href="/guide-maillots" className="hover:text-blue-950 transition-colors">
              Guide images
            </Link>
          </div>
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