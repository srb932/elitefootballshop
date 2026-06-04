"use client"

import { LEAGUE_OPTIONS } from "@/lib/clubs"

export function LeagueNav({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (league: string) => void
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Navigation championnats">
      {LEAGUE_OPTIONS.map((league) => {
        const active = selected === league
        return (
          <button
            key={league}
            type="button"
            onClick={() => onSelect(league)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-colors ${
              active
                ? "bg-blue-950 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-950 hover:text-blue-950"
            }`}
          >
            {league}
          </button>
        )
      })}
    </nav>
  )
}
