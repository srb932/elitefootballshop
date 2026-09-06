"use client"

import { useTransition } from "react"
import { setHighlight } from "@/app/admin/products/actions"
import type { ProductSection } from "@/types/product"

const SECTION_LABELS: Record<ProductSection, string> = {
  vedette: "À la une",
  tendance: "Tendances",
  nouveau: "Nouveautés",
  promo: "Promos",
}

export function HighlightControls({
  productId,
  overrideSection,
  hidden,
}: {
  productId: string
  overrideSection: ProductSection | null
  hidden: boolean
}) {
  const [pending, startTransition] = useTransition()

  function apply(section: ProductSection | null, nextHidden: boolean) {
    startTransition(() => {
      void setHighlight(productId, section, nextHidden)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select
        disabled={pending || hidden}
        value={overrideSection ?? ""}
        onChange={(e) => apply(e.target.value ? (e.target.value as ProductSection) : null, false)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
      >
        <option value="">Automatique</option>
        {(Object.keys(SECTION_LABELS) as ProductSection[]).map((s) => (
          <option key={s} value={s}>
            Épingler : {SECTION_LABELS[s]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => apply(null, !hidden)}
        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
          hidden ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {hidden ? "Masqué" : "Masquer"}
      </button>
    </div>
  )
}
