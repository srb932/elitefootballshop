import { CLUBS_BY_LEAGUE } from "./clubs"
import { slugify } from "./products"
import type { Maillot } from "@/types/product"

export interface CatalogState {
  league: string
  clubSlug: string | null
}

export function parseCatalogState(params: URLSearchParams): CatalogState {
  return {
    league: params.get("league") || "Accueil",
    clubSlug: params.get("club"),
  }
}

export function buildCatalogUrl(state: CatalogState, extra?: Record<string, string>): string {
  if (state.league === "Accueil" && !state.clubSlug) {
    const p = new URLSearchParams(extra)
    const q = p.toString()
    return q ? `/?${q}` : "/"
  }

  const params = new URLSearchParams({ league: state.league })
  if (state.clubSlug) params.set("club", state.clubSlug)
  if (extra) Object.entries(extra).forEach(([k, v]) => params.set(k, v))
  return `/?${params.toString()}`
}

export function getClubsForLeague(
  league: string,
  products: Maillot[]
): { name: string; slug: string; count: number }[] {
  const clubs = CLUBS_BY_LEAGUE[league]
  if (!clubs) return []

  return clubs.map((name) => {
    const slug = slugify(name)
    const count = products.filter((p) => p.league === league && p.clubSlug === slug).length
    return { name, slug, count }
  })
}

export function getProductsForClub(products: Maillot[], clubSlug: string): Maillot[] {
  return products.filter((p) => p.clubSlug === clubSlug)
}

export function getClubName(league: string, clubSlug: string): string | undefined {
  return CLUBS_BY_LEAGUE[league]?.find((c) => slugify(c) === clubSlug)
}
