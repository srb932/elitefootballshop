import Link from "next/link"
import type { Maillot } from "@/types/product"

function UnavailableCard({ maillot }: { maillot: Maillot }) {
  return (
    <div className="relative bg-white border border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col opacity-75 cursor-not-allowed">
      <div className="relative bg-gray-100 h-48 md:h-56 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-gray-500 text-center">Pas encore disponible</p>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-medium text-gray-400 uppercase">
          {maillot.typeLabel} · {maillot.saison}
        </p>
        <h3 className="text-sm font-medium text-gray-500 line-clamp-2 mt-1">{maillot.name}</h3>
        <span className="mt-3 block w-full text-center bg-gray-100 text-gray-400 text-xs font-medium py-2.5 rounded-lg">
          Bientôt en stock
        </span>
      </div>
    </div>
  )
}

export function ProductGrid({
  products,
  returnUrl = "/",
  showUnavailable = true,
}: {
  products: Maillot[]
  returnUrl?: string
  showUnavailable?: boolean
}) {
  const list = showUnavailable ? products : products.filter((p) => p.available)

  if (list.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
        Aucun maillot trouvé.
      </div>
    )
  }

  const encodedReturn = encodeURIComponent(returnUrl)
  const availableCount = list.filter((p) => p.available).length

  return (
    <div>
      {showUnavailable && products.length > 0 && (
        <p className="text-xs text-gray-500 mb-4">
          {availableCount} disponible{availableCount !== 1 ? "s" : ""} sur {list.length} maillot{list.length !== 1 ? "s" : ""}
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((maillot) => {
          if (!maillot.available) {
            return <UnavailableCard key={maillot.id} maillot={maillot} />
          }

          return (
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
                <p className="text-[10px] font-medium text-gray-500 uppercase">
                  {maillot.typeLabel} · {maillot.saison}
                </p>
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
          )
        })}
      </div>
    </div>
  )
}
