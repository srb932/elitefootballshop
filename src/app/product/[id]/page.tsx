import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product/ProductDetail"
import { getProductById } from "@/lib/products"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Chargement...</div>}>
      <ProductDetail product={product} />
    </Suspense>
  )
}
