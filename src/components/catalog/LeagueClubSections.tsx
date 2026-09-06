"use client"

import { useMemo } from "react"
import type { Maillot } from "@/types/product"
import { buildCatalogUrl } from "@/lib/catalog"
import { ClubLogo } from "./ClubLogo"
import { ProductGrid } from "./ProductGrid"

interface ClubSection {
  slug: string
  name: string
  items: Maillot[]
}

export function LeagueClubSections({
  league,
  products,
  onSelectClub,
}: {
  league: string
  products: Maillot[]
  onSelectClub: (clubSlug: string) => void
}) {
  const leagueUrl = useMemo(() => buildCatalogUrl({ league, clubSlug: null }), [league])

  const clubs = useMemo(() => {
    const byClub = new Map<string, ClubSection>()
    for (const p of products) {
      if (!p.available) continue
      const entry = byClub.get(p.clubSlug)
      if (entry) entry.items.push(p)
      else byClub.set(p.clubSlug, { slug: p.clubSlug, name: p.club, items: [p] })
    }
    return [...byClub.values()]
  }, [products])

  if (clubs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
        Aucun maillot disponible pour l&apos;instant dans ce championnat.
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {clubs.map((club) => (
        <section key={club.slug}>
          <button
            type="button"
            onClick={() => onSelectClub(club.slug)}
            className="group mb-4 flex w-full items-center gap-3 border-b border-gray-200 pb-3 text-left"
          >
            <ClubLogo slug={club.slug} name={club.name} size={40} />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-950 truncate">{club.name}</h2>
              <p className="text-xs text-gray-500">
                {club.items.length} maillot{club.items.length > 1 ? "s" : ""} disponible{club.items.length > 1 ? "s" : ""}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-blue-950 opacity-0 transition-opacity group-hover:opacity-100">
              Voir tout →
            </span>
          </button>
          <ProductGrid products={club.items} returnUrl={leagueUrl} showUnavailable={false} />
        </section>
      ))}
    </div>
  )
}
