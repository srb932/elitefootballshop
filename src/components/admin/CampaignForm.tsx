"use client"

import { useActionState } from "react"
import { sendCampaignAction, type CampaignActionState } from "@/app/admin/newsletter/actions"

export function CampaignForm({ activeCount }: { activeCount: number }) {
  const [state, formAction, pending] = useActionState<CampaignActionState, FormData>(sendCampaignAction, null)

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <label className="block text-xs font-bold text-slate-600">
        Sujet
        <input
          name="subject"
          required
          placeholder="Ex : -20% ce week-end sur toute la boutique"
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
        />
      </label>
      <label className="block text-xs font-bold text-slate-600">
        Message
        <textarea
          name="body"
          required
          rows={8}
          placeholder="Écrivez votre message ici. Séparez les paragraphes par une ligne vide."
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
        />
      </label>

      {state && "error" in state && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          Échec de l&apos;envoi : {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
          Campagne envoyée à {state.sent} abonné{state.sent > 1 ? "s" : ""} !
        </p>
      )}

      <button
        disabled={pending}
        className="rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : `Envoyer à ${activeCount} abonné${activeCount > 1 ? "s" : ""}`}
      </button>
    </form>
  )
}
