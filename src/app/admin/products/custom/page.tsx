import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { CUSTOM_LEAGUES, toCustomProductId } from "@/lib/db-catalog"
import { PageHeader, EmptyState } from "@/components/admin/AdminUi"
import { createCustomProductAction, deleteCustomProductAction, updateCustomProductAction } from "./actions"

export const dynamic = "force-dynamic"

const TYPE_OPTIONS = ["Domicile", "Extérieur", "Third"]

export default async function CustomProductsPage() {
  const products = await prisma.product.findMany({
    include: { club: { include: { league: true } } },
    where: { club: { league: { name: { in: [...CUSTOM_LEAGUES] } } } },
    orderBy: { createdAt: "desc" },
  })

  const byLeague = CUSTOM_LEAGUES.map((league) => ({
    league,
    items: products.filter((p) => p.club.league.name === league),
  }))

  return (
    <>
      <PageHeader
        title="Pays / Nations & Autre"
        description="Ajoutez, renommez ou supprimez des maillots qui ne font pas partie des championnats du site (équipes nationales, éditions spéciales...). Tout est géré ici, sans toucher au code."
      />

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-blue-950">Ajouter un maillot</h2>
        <form action={createCustomProductAction} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-bold text-slate-600">
            Catégorie
            <select name="league" required className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              {CUSTOM_LEAGUES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            Équipe / sélection
            <input name="clubName" required placeholder="Ex : Brésil" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Nom du maillot
            <input name="name" required placeholder="Ex : Maillot Brésil Domicile 2026" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Type
            <select name="typeLabel" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            Saison / info
            <input name="saison" placeholder="Ex : 2026" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-bold text-slate-600">
              Prix (€)
              <input name="price" type="number" step="0.01" min="0" required className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Prix barré (optionnel)
              <input name="oldPrice" type="number" step="0.01" min="0" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="text-xs font-bold text-slate-600">
            Image avant
            <input name="imageFront" type="file" accept="image/*" required className="mt-1.5 w-full text-sm" />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Image arrière
            <input name="imageBack" type="file" accept="image/*" required className="mt-1.5 w-full text-sm" />
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
              Ajouter le maillot
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8 space-y-8">
        {byLeague.map(({ league, items }) => (
          <section key={league} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-blue-950">{league}</h2>
              <p className="text-xs text-slate-500">{items.length} maillot{items.length > 1 ? "s" : ""}</p>
            </div>
            {items.length ? (
              <div className="divide-y divide-slate-100">
                {items.map((product) => (
                  <form
                    key={product.id}
                    action={updateCustomProductAction.bind(null, toCustomProductId(product.id))}
                    className="flex flex-wrap items-center gap-3 px-5 py-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" />
                      )}
                    </div>
                    <input
                      name="name"
                      defaultValue={product.name}
                      className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
                    />
                    <input name="saison" defaultValue={product.saison} placeholder="Saison" className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <select name="typeLabel" defaultValue={product.typeLabel} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input name="price" type="number" step="0.01" min="0" defaultValue={product.price} className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input name="oldPrice" type="number" step="0.01" min="0" defaultValue={product.oldPrice ?? ""} placeholder="Barré" className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                      Enregistrer
                    </button>
                    <button
                      type="submit"
                      formAction={deleteCustomProductAction.bind(null, toCustomProductId(product.id))}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </form>
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState>Aucun maillot ajouté pour l&apos;instant dans cette catégorie.</EmptyState>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  )
}
