import { prisma } from "@/lib/prisma"
import { PageHeader, StatCard, EmptyState } from "@/components/admin/AdminUi"
import { CampaignForm } from "@/components/admin/CampaignForm"

export const dynamic = "force-dynamic"

export default async function NewsletterPage() {
  const [activeCount, unsubscribedCount, campaigns] = await Promise.all([
    prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribedAt: { not: null } } }),
    prisma.newsletterCampaign.findMany({
      include: { sentBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ])

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Rédigez une annonce ou une promo et envoyez-la à tous les abonnés — chacun reçoit un email individuel avec un lien de désabonnement."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Abonnés actifs" value={String(activeCount)} />
        <StatCard label="Désabonnés" value={String(unsubscribedCount)} />
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-blue-950">Nouvelle campagne</h2>
        <CampaignForm activeCount={activeCount} />
      </section>

      <section className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-blue-950">Campagnes envoyées</h2>
        </div>
        {campaigns.length ? (
          <div className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-900">{c.subject}</p>
                  <span className="text-xs text-slate-500">
                    {c.recipients} destinataire{c.recipients > 1 ? "s" : ""} · {c.createdAt.toLocaleString("fr-FR")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.body}</p>
                <p className="mt-1 text-xs text-slate-400">Par {c.sentBy?.name || c.sentBy?.email || "Administrateur"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState>Aucune campagne envoyée pour l&apos;instant.</EmptyState>
          </div>
        )}
      </section>
    </>
  )
}
