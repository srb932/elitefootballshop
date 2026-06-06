import type { Maillot, ProductSection } from "@/types/product"
import { SECTION_LABELS } from "@/types/product"
import { ProductGrid } from "./ProductGrid"

const SECTION_ORDER: ProductSection[] = ["vedette", "tendance", "nouveau", "promo"]

export function HomeFeatured({ products, returnUrl = "/" }: { products: Maillot[]; returnUrl?: string }) {
  return (
    <div className="space-y-10">
      {SECTION_ORDER.map((section) => {
        const items = products.filter((p) => p.section === section)
        if (items.length === 0) return null

        return (
          <section key={section}>
            <div className="flex items-end justify-between mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-black uppercase text-gray-900 tracking-wide">
                {SECTION_LABELS[section]}
              </h2>
              <span className="text-xs text-gray-500 font-medium">{items.length} maillot{items.length > 1 ? "s" : ""}</span>
            </div>
            <ProductGrid products={items} returnUrl={returnUrl} />
          </section>
        )
      })}
    </div>
  )
}
