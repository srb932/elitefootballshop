import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product/ProductDetail"
import { getProductById, MOCK_MAILLOTS } from "@/lib/products"
import { fromCustomProductId, getCustomMaillotById } from "@/lib/db-catalog"

// Pré-génère à la build toutes les fiches produits dont les images sont
// disponibles : navigation instantanée (HTML statique) sans aucun calcul
// serveur à la requête. Les maillots personnalisés (Pays/Nations, Autre)
// viennent de la base et sont rendus à la demande (dynamicParams).
export function generateStaticParams() {
  return MOCK_MAILLOTS.filter((p) => p.available).map((p) => ({ id: p.id }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dbId = fromCustomProductId(id)
  const product = dbId ? await getCustomMaillotById(dbId) : getProductById(id)

  if (!product || !product.available) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Chargement...</div>}>
      <ProductDetail product={product} />
    </Suspense>
  )
}
