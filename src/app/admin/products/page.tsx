import { CLUBS_BY_LEAGUE } from "@/lib/clubs"
import { MOCK_MAILLOTS } from "@/lib/products"
import { flagship } from "@/lib/trending"
import { getProductOverrides } from "@/lib/product-highlights"
import { HighlightControls } from "@/components/admin/HighlightControls"
import { PageHeader, StatCard } from "@/components/admin/AdminUi"
import { ClubLogo } from "@/components/catalog/ClubLogo"
import type { ProductSection } from "@/types/product"

export const dynamic = "force-dynamic"

const SECTION_LABELS: Record<ProductSection, string> = {
  vedette: "À la une",
  tendance: "Tendances",
  nouveau: "Nouveautés",
  promo: "Promos",
}

const SECTION_COLORS: Record<ProductSection, string> = {
  vedette: "bg-blue-100 text-blue-800",
  tendance: "bg-violet-100 text-violet-700",
  nouveau: "bg-emerald-100 text-emerald-700",
  promo: "bg-amber-100 text-amber-700",
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/admin/products">) {
  const { q = "" } = await searchParams
  const query = (typeof q === "string" ? q : "").trim().toLowerCase()

  const overrides = await getProductOverrides()

  const totalAvailable = MOCK_MAILLOTS.filter((p) => p.available).length
  const totalSlots = MOCK_MAILLOTS.length
  const pinnedCount = [...overrides.values()].filter((o) => o.section).length
  const hiddenCount = [...overrides.values()].filter((o) => o.hidden).length

  const leagues = Object.entries(CLUBS_BY_LEAGUE)
    .map(([league, clubs]) => ({
      league,
      clubs: clubs
        .map((club) => {
          const clubProducts = MOCK_MAILLOTS.filter((p) => p.club === club)
          const available = clubProducts.filter((p) => p.available).length
          const flag = flagship(clubProducts)
          const override = flag ? overrides.get(flag.id) : undefined
          return {
            name: club,
            slug: clubProducts[0]?.clubSlug ?? "",
            available,
            total: clubProducts.length,
            flagshipId: flag?.id ?? null,
            autoSection: (flag?.section as ProductSection | undefined) ?? null,
            overrideSection: override?.section ?? null,
            hidden: override?.hidden ?? false,
          }
        })
        .filter((club) => !query || club.name.toLowerCase().includes(query)),
    }))
    .filter((group) => group.clubs.length > 0)

  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Le catalogue vendu vient des maillots importés dans le dossier du site (voir /guide-maillots). Choisissez ici quels maillots apparaissent dans les sections mises en avant de l'accueil — le reste est calculé automatiquement selon l'actualité du football."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Maillots disponibles" value={String(totalAvailable)} hint={`sur ${totalSlots} emplacements`} />
        <StatCard label="Championnats" value={String(Object.keys(CLUBS_BY_LEAGUE).length)} />
        <StatCard label="Épinglés manuellement" value={String(pinnedCount)} />
        <StatCard label="Masqués des mises en avant" value={String(hiddenCount)} />
      </section>

      <form className="mt-6 flex gap-3">
        <input
          name="q"
          defaultValue={query}
          placeholder="Rechercher un club…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white">Filtrer</button>
      </form>

      <div className="mt-6 space-y-8">
        {leagues.map(({ league, clubs }) => (
          <section key={league} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-blue-950">{league}</h2>
              <p className="text-xs text-slate-500">
                {clubs.filter((c) => c.available > 0).length} / {clubs.length} clubs avec au moins un maillot
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {clubs.map((club) => {
                const effectiveSection = club.overrideSection ?? club.autoSection
                return (
                  <div key={club.name} className="flex flex-wrap items-center gap-4 px-5 py-3">
                    <ClubLogo slug={club.slug} name={club.name} size={36} />
                    <div className="min-w-[160px] flex-1">
                      <p className="text-sm font-bold text-slate-900">{club.name}</p>
                      <p className="text-xs text-slate-500">
                        {club.available} / {club.total} maillot{club.total > 1 ? "s" : ""} importé{club.available > 1 ? "s" : ""}
                      </p>
                    </div>

                    {effectiveSection && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${SECTION_COLORS[effectiveSection]}`}>
                        {SECTION_LABELS[effectiveSection]}
                        {club.overrideSection ? " · épinglé" : " · auto"}
                      </span>
                    )}
                    {club.hidden && (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">Masqué</span>
                    )}

                    {club.flagshipId ? (
                      <HighlightControls
                        productId={club.flagshipId}
                        overrideSection={club.overrideSection}
                        hidden={club.hidden}
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Aucune image importée</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
