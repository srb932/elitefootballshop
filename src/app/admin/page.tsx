import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatEuro, orderLabel } from "@/lib/admin"
import { EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/admin/AdminUi"
import { MOCK_MAILLOTS } from "@/lib/products"

export const dynamic = "force-dynamic"

const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export default async function AdminDashboard() {
  const now = new Date(), today = startOfDay(now), month = new Date(now.getFullYear(), now.getMonth(), 1), onlineSince = new Date(now.getTime() - 5 * 60_000)
  const [totalUsers, newUsers, onlineUsers, todayOrders, monthOrders, activeCarts, abandonedCarts, recentOrders, recentActivity] = await Promise.all([
    prisma.user.count(), prisma.user.count({ where: { createdAt: { gte: today } } }), prisma.user.count({ where: { lastSeen: { gte: onlineSince } } }),
    prisma.order.findMany({ where: { createdAt: { gte: today } }, select: { total: true, paymentStatus: true } }), prisma.order.findMany({ where: { createdAt: { gte: month } }, select: { total: true, paymentStatus: true } }),
    prisma.cart.count({ where: { updatedAt: { gte: new Date(now.getTime() - 60 * 60_000) } } }), prisma.cart.count({ where: { updatedAt: { lt: new Date(now.getTime() - 24 * 60 * 60_000) }, total: { gt: 0 } } }),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, items: true } }),
    prisma.adminActivity.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { actor: { select: { name: true, email: true } } } }),
  ])
  const revenueToday = todayOrders.filter((o) => o.paymentStatus === "PAID").reduce((sum, o) => sum + o.total, 0)
  const revenueMonth = monthOrders.filter((o) => o.paymentStatus === "PAID").reduce((sum, o) => sum + o.total, 0)
  const average = monthOrders.length ? revenueMonth / monthOrders.length : 0
  const availableProducts = MOCK_MAILLOTS.filter((p) => p.available).length
  return <>
    <PageHeader title="Vue d’ensemble" description="L’activité réelle de votre boutique, actualisée à chaque ouverture." />
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Utilisateurs en ligne" value={String(onlineUsers)} hint="actifs ces 5 dernières minutes" /><StatCard label="Commandes aujourd’hui" value={String(todayOrders.length)} /><StatCard label="CA du jour" value={formatEuro(revenueToday)} /><StatCard label="Paniers actifs" value={String(activeCarts)} hint={`${abandonedCarts} paniers abandonnés`} /><StatCard label="Utilisateurs" value={String(totalUsers)} hint={`${newUsers} nouveaux aujourd’hui`} /><StatCard label="Commandes du mois" value={String(monthOrders.length)} /><StatCard label="CA du mois" value={formatEuro(revenueMonth)} /><StatCard label="Panier moyen" value={formatEuro(average)} /><StatCard label="Maillots en ligne" value={String(availableProducts)} hint={`sur ${MOCK_MAILLOTS.length} emplacements catalogue`} /></section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-blue-950">Commandes récentes</h2><Link href="/admin/orders" className="text-sm font-semibold text-blue-800">Voir tout</Link></div>{recentOrders.length ? <div className="space-y-3">{recentOrders.map((order) => <Link href={`/admin/orders/${order.id}`} key={order.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50"><div><p className="font-bold">#{order.id.slice(-8).toUpperCase()}</p><p className="text-xs text-slate-500">{order.user?.name || order.guestEmail || order.user?.email || "Client invité"} · {order.items.length} article(s)</p></div><div className="text-right"><p className="font-bold">{formatEuro(order.total)}</p><StatusBadge value={order.status} /></div></Link>)}</div> : <EmptyState>Aucune commande enregistrée pour le moment.</EmptyState>}</div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-blue-950">Activité récente</h2><Link href="/admin/activity" className="text-sm font-semibold text-blue-800">Journal</Link></div>{recentActivity.length ? <div className="space-y-4">{recentActivity.map((activity) => <div key={activity.id}><p className="text-sm font-semibold">{activity.action}</p><p className="text-xs text-slate-500">{activity.actor?.name || activity.actor?.email || "Système"} · {activity.createdAt.toLocaleString("fr-FR")}</p></div>)}</div> : <EmptyState>Les actions administrateur et événements de boutique apparaîtront ici.</EmptyState>}</div></section>
  </>
}
