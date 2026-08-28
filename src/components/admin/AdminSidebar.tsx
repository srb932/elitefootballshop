"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { BarChart3, Bell, ClipboardList, LayoutDashboard, Menu, Package, Settings, ShoppingCart, Users, X, Activity } from "lucide-react"
import { useState } from "react"

const links = [
  ["Dashboard", "/admin", LayoutDashboard], ["Commandes", "/admin/orders", ClipboardList],
  ["Utilisateurs", "/admin/users", Users], ["Paniers", "/admin/carts", ShoppingCart],
  ["Produits", "/admin/products", Package], ["Statistiques", "/admin/statistics", BarChart3],
  ["Activité", "/admin/activity", Activity], ["Support", "/admin/support", Bell], ["Notifications", "/admin/notifications", Bell],
  ["Paramètres", "/admin/settings", Settings],
] as const

export function AdminSidebar({ name, email }: { name: string | null; email: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menu = <nav className="space-y-1">{links.map(([label, href, Icon]) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
    return <Link onClick={() => setOpen(false)} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-white text-blue-950 shadow-sm" : "text-blue-100 hover:bg-white/10 hover:text-white"}`}><Icon size={18} />{label}</Link>
  })}</nav>

  return <>
    <button className="fixed left-4 top-4 z-50 rounded-lg bg-blue-950 p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</button>
    {open && <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-label="Fermer le menu" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-blue-950 p-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <Link href="/admin" className="mb-9 px-2"><div className="text-lg font-black tracking-tight">ELITE<span className="text-red-500">FOOTBALL</span>SHOP</div><div className="mt-1 text-xs font-medium tracking-widest text-blue-200">ADMINISTRATION</div></Link>
      {menu}
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3"><p className="truncate text-sm font-bold">{name || "Administrateur"}</p><p className="truncate text-xs text-blue-200">{email}</p><button onClick={() => signOut({ callbackUrl: "/" })} className="mt-3 text-xs font-semibold text-blue-100 hover:text-white">Déconnexion</button></div>
    </aside>
  </>
}
