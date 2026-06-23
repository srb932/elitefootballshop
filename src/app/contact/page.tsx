"use client"

import { useState } from "react"
import Link from "next/link"
import { PromoBanner } from "@/components/catalog/PromoBanner"

const SUPPORT_EMAIL = "lamedumaillot.support@gmail.com"

export default function ContactPage() {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [sujet, setSujet] = useState("")
  const [message, setMessage] = useState("")

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(sujet || "Question L'Âme du Maillot")}&body=${encodeURIComponent(
    `Nom : ${nom}\nEmail : ${email}\n\n${message}`
  )}`

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-[family-name:var(--font-inter)]">
      <PromoBanner />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-sm font-medium text-blue-950 hover:underline">
            ← Retour à la boutique
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Contact & support</h1>
        <p className="text-sm text-gray-600 mb-8">
          Une question sur une commande, un maillot ou un problème technique ? Notre équipe vous répond sous 24–48h.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Email direct</h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-950 font-medium hover:underline break-all"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="text-xs text-gray-500 mt-3">Disponible 7j/7 — réponse sous 24–48h</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Guide images</h2>
            <p className="text-xs text-gray-600 mb-3">Comment nommer vos maillots pour le site ?</p>
            <Link href="/guide-maillots" className="text-sm font-medium text-blue-950 hover:underline">
              Voir le guide des fichiers →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Envoyer un message</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Votre nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Votre email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Sujet</label>
            <select
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950 bg-white"
            >
              <option value="">Choisir un sujet</option>
              <option value="Question commande">Question sur ma commande</option>
              <option value="Problème livraison">Problème de livraison</option>
              <option value="Question maillot">Question sur un maillot</option>
              <option value="Problème paiement">Problème de paiement</option>
              <option value="Autre">Autre question</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Décrivez votre question ou problème..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950 resize-none"
            />
          </div>

          <a
            href={mailtoHref}
            className="block w-full text-center bg-blue-950 hover:bg-blue-900 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
          >
            Envoyer par email
          </a>
          <p className="text-xs text-gray-400 text-center">
            Cela ouvrira votre application email avec le message pré-rempli.
          </p>
        </div>
      </main>
    </div>
  )
}
