"use client"

import { useMemo, useState } from "react"

export type GuideEntry = {
  club: string
  clubSlug: string
  league: string
  type: string
  saison: string
  avant: string
  arriere: string
  available: boolean
}

const PAGE_SIZES = [25, 50, 100] as const

export function MissingMaillotsTable({ entries }: { entries: GuideEntry[] }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const [leagueFilter, setLeagueFilter] = useState("Tous")
  const [search, setSearch] = useState("")

  const leagues = useMemo(
    () => ["Tous", ...Array.from(new Set(entries.map((e) => e.league))).sort()],
    [entries]
  )

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (leagueFilter !== "Tous" && e.league !== leagueFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        e.club.toLowerCase().includes(q) ||
        e.league.toLowerCase().includes(q) ||
        e.avant.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      )
    })
  }, [entries, leagueFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher un club..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-950"
        />
        <select
          value={leagueFilter}
          onChange={(e) => {
            setLeagueFilter(e.target.value)
            setPage(1)
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-950"
        >
          {leagues.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-950"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {filtered.length} maillot{filtered.length !== 1 ? "s" : ""} à ajouter
        {filtered.length > 0 && (
          <> — page {safePage} sur {totalPages} ({start + 1}–{Math.min(start + pageSize, filtered.length)})</>
        )}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4">Club</th>
              <th className="py-2 pr-4">Championnat</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Saison</th>
              <th className="py-2 pr-4">Fichier avant</th>
              <th className="py-2">Fichier arrière</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Aucun résultat pour ce filtre.
                </td>
              </tr>
            ) : (
              pageItems.map((e) => (
                <tr key={`${e.clubSlug}-${e.type}-${e.saison}`} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-gray-800">{e.club}</td>
                  <td className="py-2 pr-4 text-gray-600">{e.league}</td>
                  <td className="py-2 pr-4 text-gray-600">{e.type}</td>
                  <td className="py-2 pr-4 text-gray-600">{e.saison}</td>
                  <td className="py-2 pr-4 font-mono text-gray-700">{e.avant}</td>
                  <td className="py-2 font-mono text-gray-700">{e.arriere}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={safePage === 1}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-950 hover:text-blue-950"
          >
            « Début
          </button>
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-950 hover:text-blue-950"
          >
            ‹ Précédent
          </button>

          {getPageNumbers(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p as number)}
                className={`min-w-[2rem] px-2 py-1.5 text-xs font-medium rounded-lg border ${
                  safePage === p
                    ? "bg-blue-950 text-white border-blue-950"
                    : "border-gray-200 hover:border-blue-950 hover:text-blue-950"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-950 hover:text-blue-950"
          >
            Suivant ›
          </button>
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-950 hover:text-blue-950"
          >
            Fin »
          </button>
        </div>
      )}
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]

  if (current > 3) pages.push("...")

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }

  if (current < total - 2) pages.push("...")

  pages.push(total)
  return pages
}
