import type { Maillot } from "@/types/product"

export function searchProducts(
  products: Maillot[],
  query: string,
  league: string,
  clubSlug?: string | null
): Maillot[] {
  const q = query.trim().toLowerCase()

  return products.filter((product) => {
    if (league !== "Accueil" && product.league !== league) return false
    if (clubSlug && product.clubSlug !== clubSlug) return false
    if (!q) return Boolean(clubSlug) || league !== "Accueil"

    return (
      product.name.toLowerCase().includes(q) ||
      product.club.toLowerCase().includes(q) ||
      product.league.toLowerCase().includes(q)
    )
  })
}
