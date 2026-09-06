import { CatalogClient } from "@/components/catalog/CatalogClient"
import { MOCK_MAILLOTS } from "@/lib/products"
import { getProductOverrides } from "@/lib/product-highlights"
import { getCustomMaillots } from "@/lib/db-catalog"
import { applyOverrides } from "@/lib/trending"

// Les mises en avant choisies dans l'admin (épinglage / masquage) et les
// maillots personnalisés (Pays/Nations, Autre) sont chargés côté serveur
// puis fusionnés avant d'envoyer la page au client — pas d'appel réseau
// supplémentaire depuis le navigateur pour ça.
export const revalidate = 60

export default async function CatalogPage() {
  const [overrides, customMaillots] = await Promise.all([getProductOverrides(), getCustomMaillots()])
  const allProducts = [...MOCK_MAILLOTS, ...customMaillots]
  const featuredProducts = applyOverrides(allProducts, overrides)

  return <CatalogClient allProducts={allProducts} featuredProducts={featuredProducts} />
}
