/**
 * Catalogue maillots — voir aussi /guide-maillots pour les noms de fichiers images
 * Dossier images : public/maillots/ | Logos : public/logos/
 */
import { CLUBS_BY_LEAGUE } from "./clubs"
import { MAILLOT_VARIANTS } from "./maillot-images"
import { resolveMaillotImages } from "./resolve-maillot-images"
import { deriveAutoSections } from "./trending"
import type { Maillot, MaillotType, ProductSection } from "@/types/product"
import { PRODUCT_OLD_PRICE, PRODUCT_PRICE } from "@/types/product"

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
  const id = `${slugify(league)}-${clubSlug}-${type}-${code}`

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
    badge: "",
    section: undefined,
    available: images.available,
    imageFront: images.imageFront,
    imageBack: images.imageBack,
    frontFile: images.frontFile,
    backFile: images.backFile,
  }
}

// Les sections "À la une / Tendances / Nouveautés / Promos" sont calculées
// automatiquement à partir du catalogue réellement disponible — voir
// ./trending. Les mises en avant manuelles de l'admin s'appliquent ensuite
// par-dessus (voir applyOverrides), au moment de l'affichage.
export const MOCK_MAILLOTS: Maillot[] = deriveAutoSections(
  Object.entries(CLUBS_BY_LEAGUE).flatMap(([league, clubs]) =>
    clubs.flatMap((club) =>
      MAILLOT_VARIANTS.map((v) => buildMaillot(league, club, v.type, v.typeLabel, v.saison, v.code))
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
