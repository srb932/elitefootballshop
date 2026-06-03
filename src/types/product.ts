export interface Maillot {
  id: string
  name: string
  price: number
  oldPrice: number
  league: string
  club: string
  badge: string
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
