export type ProductSection = "vedette" | "tendance" | "nouveau" | "promo"

export interface Maillot {
  id: string
  name: string
  price: number
  oldPrice: number
  league: string
  club: string
  clubSlug: string
  badge: string
  section?: ProductSection
  imageFront: string
  imageBack: string
}

export interface FlocageOptions {
  nom: string
  numero: string
  nomEnBas: string
}

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const
export type Size = (typeof SIZES)[number]

export const SECTION_LABELS: Record<ProductSection, string> = {
  vedette: "À la une",
  tendance: "Tendances",
  nouveau: "Nouveautés",
  promo: "Promos",
}
