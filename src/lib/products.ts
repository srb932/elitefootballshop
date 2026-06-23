/**
 * Catalogue maillots — voir aussi /guide-maillots pour les noms de fichiers images
 * Dossier images : public/maillots/ | Logos : public/logos/
 */
import { CLUBS_BY_LEAGUE } from "./clubs"
import { MAILLOT_VARIANTS } from "./maillot-images"
import { resolveMaillotImages } from "./resolve-maillot-images"
import type { Maillot, MaillotType, ProductSection } from "@/types/product"
import { PRODUCT_OLD_PRICE, PRODUCT_PRICE } from "@/types/product"

const SECTION_BY_CLUB: Record<string, ProductSection> = {
  "Paris Saint-Germain": "vedette",
  "Real Madrid": "tendance",
  "FC Barcelona": "tendance",
  "Liverpool FC": "tendance",
  "Olympique Marseille": "nouveau",
  "AS Monaco": "nouveau",
  "Olympique Lyonnais": "promo",
  Arsenal: "promo",
  "Manchester City": "promo",
  "Bayern Munich": "tendance",
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function buildMaillot(
  league: string,
  club: string,
  type: MaillotType,
  typeLabel: string,
  saison: string,
  code: string
): Maillot {
  const clubSlug = slugify(club)
  const images = resolveMaillotImages(clubSlug, type, code)
  const isFeaturedHome = type === "domicile" && code === "2526"
  const section = isFeaturedHome ? SECTION_BY_CLUB[club] : undefined
  const id = `${slugify(league)}-${clubSlug}-${type}-${code}`

  const badgeMap: Record<ProductSection, string> = {
    vedette: "VEDETTE",
    tendance: "TENDANCE",
    nouveau: "NOUVEAU",
    promo: "PROMO",
  }

  return {
    id,
    name: `Maillot ${club} ${typeLabel} ${saison}`,
    price: PRODUCT_PRICE,
    oldPrice: PRODUCT_OLD_PRICE,
    league,
    club,
    clubSlug,
    type,
    typeLabel,
    saison,
    badge: section && images.available ? badgeMap[section] : "",
    section: images.available ? section : undefined,
    available: images.available,
    imageFront: images.imageFront,
    imageBack: images.imageBack,
    frontFile: images.frontFile,
    backFile: images.backFile,
  }
}

export const MOCK_MAILLOTS: Maillot[] = Object.entries(CLUBS_BY_LEAGUE).flatMap(
  ([league, clubs]) =>
    clubs.flatMap((club) =>
      MAILLOT_VARIANTS.map((v) =>
        buildMaillot(league, club, v.type, v.typeLabel, v.saison, v.code)
      )
    )
)

export function getProductById(id: string): Maillot | undefined {
  return MOCK_MAILLOTS.find((p) => p.id === id)
}

export function getProductsBySection(section: ProductSection): Maillot[] {
  return MOCK_MAILLOTS.filter((p) => p.section === section && p.available)
}

export function getImageGuideEntries(): {
  club: string
  clubSlug: string
  league: string
  type: string
  saison: string
  avant: string
  arriere: string
  available: boolean
}[] {
  return MOCK_MAILLOTS.map((p) => ({
    club: p.club,
    clubSlug: p.clubSlug,
    league: p.league,
    type: p.typeLabel,
    saison: p.saison,
    avant: p.frontFile,
    arriere: p.backFile,
    available: p.available,
  }))
}
