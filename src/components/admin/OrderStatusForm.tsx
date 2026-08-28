"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function OrderStatusForm({ id, status, shippingStatus }: { id: string; status: string; shippingStatus: string }) {
  const [orderStatus, setOrderStatus] = useState(status); const [shipping, setShipping] = useState(shippingStatus); const [saving, setSaving] = useState(false); const router = useRouter()
  async function save() { setSaving(true); const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: orderStatus, shippingStatus: shipping }) }); setSaving(false); if (response.ok) router.refresh(); else alert("La mise à jour a échoué.") }
  return <div className="flex flex-wrap items-end gap-3"><label className="text-xs font-bold text-slate-500">Statut commande<select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800">{["PENDING","PAID","SHIPPED","DELIVERED","CANCELLED"].map((s) => <option key={s}>{s}</option>)}</select></label><label className="text-xs font-bold text-slate-500">Livraison<select value={shipping} onChange={(e) => setShipping(e.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800">{["PENDING","PREPARING","SHIPPED","DELIVERED","CANCELLED"].map((s) => <option key={s}>{s}</option>)}</select></label><button disabled={saving} onClick={save} className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer"}</button></div>
}
