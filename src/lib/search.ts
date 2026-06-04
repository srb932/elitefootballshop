import type { Maillot } from "@/types/product"

export function searchProducts(
  products: Maillot[],
  query: string,
  league: string
): Maillot[] {
  const q = query.trim().toLowerCase()

  return products.filter((product) => {
    if (league !== "Accueil" && product.league !== league) return false
    if (!q) return league !== "Accueil"

    return (
      product.name.toLowerCase().includes(q) ||
      product.club.toLowerCase().includes(q) ||
      product.league.toLowerCase().includes(q)
    )
  })
}
