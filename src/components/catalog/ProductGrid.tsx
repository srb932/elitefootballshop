import Link from "next/link"
import type { Maillot } from "@/types/product"

export function ProductGrid({
  products,
  returnUrl = "/",
}: {
  products: Maillot[]
  returnUrl?: string
}) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
        Aucun maillot trouvé.
      </div>
    )
  }

  const encodedReturn = encodeURIComponent(returnUrl)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((maillot) => (
        <Link
          key={maillot.id}
          href={`/product/${maillot.id}?return=${encodedReturn}`}
          className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-950 transition-all flex flex-col group"
        >
          {maillot.badge && (
            <span
              className={`absolute top-2 left-2 z-10 text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded ${
                maillot.badge === "PROMO" ? "bg-red-600" : maillot.badge === "VEDETTE" ? "bg-blue-950" : "bg-gray-800"
              }`}
            >
              {maillot.badge}
            </span>
          )}

          <div className="relative bg-gray-50 h-48 md:h-56 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={maillot.imageFront}
              alt={`${maillot.name} avant`}
              className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src={maillot.imageBack}
              alt={`${maillot.name} arrière`}
              className="absolute h-[calc(100%-2rem)] w-auto object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>

          <div className="p-3 flex flex-col flex-1">
            <p className="text-[10px] font-medium text-gray-500 uppercase">{maillot.league}</p>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-1 group-hover:text-blue-950">
              {maillot.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-lg font-bold text-gray-900">{maillot.price.toFixed(2)} €</span>
              <span className="text-xs text-gray-400 line-through">{maillot.oldPrice.toFixed(2)} €</span>
            </div>
            <span className="mt-3 block w-full text-center bg-blue-950 text-white text-xs font-semibold uppercase py-2.5 rounded-lg group-hover:bg-gray-900 transition-colors">
              Voir le maillot
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
