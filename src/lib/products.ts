import { CLUBS_BY_LEAGUE } from "./clubs"
import type { Maillot } from "@/types/product"

const CLUB_IMAGES: Record<string, { imageFront: string; imageBack: string }> = {
  "Paris Saint-Germain": {
    imageFront: "/maillots/psg.png",
    imageBack: "/maillots/psg1.png",
  },
  "Olympique Marseille": {
    imageFront: "/maillots/om.png",
    imageBack: "/maillots/om1.png",
  },
}

const DEFAULT_IMAGES = {
  imageFront: "/maillots/placeholder-front.svg",
  imageBack: "/maillots/placeholder-back.svg",
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function buildMaillot(league: string, club: string, index: number): Maillot {
  const images = CLUB_IMAGES[club] ?? DEFAULT_IMAGES
  const id = `${slugify(league)}-${slugify(club)}`

  return {
    id,
    name: `Maillot ${club} Domicile 2026`,
    price: 45,
    oldPrice: 89.99,
    league,
    club,
    badge: index < 3 ? "NOUVEAU" : "",
    imageFront: images.imageFront,
    imageBack: images.imageBack,
  }
}

export const MOCK_MAILLOTS: Maillot[] = Object.entries(CLUBS_BY_LEAGUE).flatMap(
  ([league, clubs]) => clubs.map((club, i) => buildMaillot(league, club, i))
)

export function getProductById(id: string): Maillot | undefined {
  return MOCK_MAILLOTS.find((p) => p.id === id)
}

export function searchProducts(
  products: Maillot[],
  query: string,
  league: string
): Maillot[] {
  const q = query.trim().toLowerCase()

  return products.filter((product) => {
    const leagueMatch = league === "Tous" || product.league === league
    if (!leagueMatch) return false
    if (!q) return true

    return (
      product.name.toLowerCase().includes(q) ||
      product.club.toLowerCase().includes(q) ||
      product.league.toLowerCase().includes(q)
    )
  })
}
