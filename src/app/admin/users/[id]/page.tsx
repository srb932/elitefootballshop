import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { formatEuro } from "@/lib/admin"
import { PageHeader, EmptyState } from "@/components/admin/AdminUi"
import { setUserRoleAction } from "./actions"

export default async function UserDetail({ params }: PageProps<"/admin/users/[id]">) {
  const { id } = await params
  const admin = await requireAdmin()

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      carts: { orderBy: { updatedAt: "desc" }, take: 1 },
    },
  })
  if (!user) notFound()

  const paid = user.orders.filter((o) => o.paymentStatus === "PAID")
  const spent = paid.reduce((sum, o) => sum + o.total, 0)
  const isSelf = user.id === admin.id

  return (
    <>
      <PageHeader title={user.name || "Client"} description={user.email} />

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Rôle</p>
            <p className="mt-1 text-lg font-black text-blue-950">
              {user.role === "ADMIN" ? "Administrateur" : "Client"}
            </p>
          </div>
          {user.role === "ADMIN" ? (
            <form action={setUserRoleAction.bind(null, user.id, "USER")}>
              <button
                disabled={isSelf}
                title={isSelf ? "Tu ne peux pas te retirer tes propres droits ici." : undefined}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Retirer les droits admin
              </button>
            </form>
          ) : (
            <form action={setUserRoleAction.bind(null, user.id, "ADMIN")}>
              <button className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
                Promouvoir administrateur
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">Commandes</p>
          <p className="text-2xl font-black">{user.orders.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">Total dépensé</p>
          <p className="text-2xl font-black">{formatEuro(spent)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">Panier moyen</p>
          <p className="text-2xl font-black">{formatEuro(paid.length ? spent / paid.length : 0)}</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-blue-950">Historique des commandes</h2>
        {user.orders.length ? (
          <div className="mt-4 space-y-3">
            {user.orders.map((o) => (
              <div className="flex justify-between border-b pb-3 last:border-0" key={o.id}>
                <span>#{o.id.slice(-8).toUpperCase()} · {o.items.length} article(s)</span>
                <span className="font-bold">{formatEuro(o.total)}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>Ce client n&apos;a pas encore commandé.</EmptyState>
        )}
      </section>
    </>
  )
}
