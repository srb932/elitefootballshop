"use client"

import type { Maillot } from "@/types/product"
import { getClubsForLeague } from "@/lib/catalog"
import { ClubLogo } from "./ClubLogo"

export function ClubGrid({
  league,
  products,
  onSelectClub,
}: {
  league: string
  products: Maillot[]
  onSelectClub: (clubSlug: string) => void
}) {
  const clubs = getClubsForLeague(league, products)

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">{league}</h2>
        <p className="text-sm text-gray-500 mt-1">Sélectionnez une équipe</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {clubs.map((club) => (
          <button
            key={club.slug}
            type="button"
            onClick={() => onSelectClub(club.slug)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-blue-950 hover:shadow-sm transition-all group"
          >
            <ClubLogo slug={club.slug} name={club.name} size={48} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-950 truncate">
                {club.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {club.count} maillot{club.count > 1 ? "s" : ""}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-blue-950 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
