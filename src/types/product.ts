export type ProductSection = "vedette" | "tendance" | "nouveau" | "promo"

export const PRODUCT_PRICE = 29.99
export const PRODUCT_OLD_PRICE = 35

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

export interface ShippingInfo {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  numero: string
  batiment: string
  etage: string
  codePostal: string
  ville: string
  pays: string
}

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const
export type Size = (typeof SIZES)[number]

export const SECTION_LABELS: Record<ProductSection, string> = {
  vedette: "À la une",
  tendance: "Tendances",
  nouveau: "Nouveautés",
  promo: "Promos",
}

export const EMPTY_SHIPPING: ShippingInfo = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse: "",
  numero: "",
  batiment: "",
  etage: "",
  codePostal: "",
  ville: "",
  pays: "France",
}
