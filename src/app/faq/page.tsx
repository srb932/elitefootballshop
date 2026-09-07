import Link from "next/link"
import { PromoBanner } from "@/components/catalog/PromoBanner"
import { BrandMark } from "@/components/layout/BrandMark"

interface FaqItem {
  question: string
  answer: string
}

interface FaqSection {
  title: string
  items: FaqItem[]
}

const SECTIONS: FaqSection[] = [
  {
    title: "Livraison",
    items: [
      {
        question: "Sous combien de temps vais-je recevoir ma commande ?",
        answer:
          "Vos maillots sont expédiés directement chez vous (La Poste, Chronopost ou transporteur équivalent) sous 2 semaines à compter de la validation de votre commande.",
      },
      {
        question: "La livraison est-elle payante ?",
        answer:
          "La livraison est actuellement offerte pour le lancement de la boutique. Cette offre est temporaire et pourra évoluer par la suite.",
      },
      {
        question: "Puis-je suivre ma commande ?",
        answer:
          "Un numéro de suivi vous sera communiqué une fois votre colis expédié. Si vous n'avez rien reçu passé le délai indiqué, contactez-nous via le chat ou le formulaire de contact.",
      },
    ],
  },
  {
    title: "Tailles & personnalisation",
    items: [
      {
        question: "Quelles tailles sont disponibles ?",
        answer: "Nos maillots sont disponibles en S, M, L, XL et XXL.",
      },
      {
        question: "Puis-je faire floquer un nom et un numéro ?",
        answer:
          "Oui, chaque maillot peut être personnalisé (nom au dos, numéro, nom en bas) directement lors de l'ajout au panier, sans supplément de prix.",
      },
    ],
  },
  {
    title: "Retours & échanges",
    items: [
      {
        question: "Puis-je retourner un maillot qui ne me convient pas ?",
        answer:
          "Oui, sous 14 jours, à condition que le maillot ne soit pas floqué (nom/numéro personnalisés). Contactez-nous via le chat ou le formulaire de contact pour lancer un retour.",
      },
      {
        question: "Et pour un maillot floqué (personnalisé) ?",
        answer:
          "Les maillots floqués sont faits sur-mesure et ne sont donc pas repris en cas de simple changement d'avis. En revanche, s'il présente un défaut de fabrication clairement visible, contactez-nous : le retour sera accepté.",
      },
    ],
  },
  {
    title: "Nos maillots",
    items: [
      {
        question: "Vos maillots sont-ils les versions officielles vendues par les clubs ?",
        answer:
          "Non : nos maillots sont des répliques non officielles (\"version fan\"), sans licence des clubs. Ils ne sont pas vendus comme des produits officiels de marque.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        question: "Le paiement est-il sécurisé ?",
        answer: "Oui, tous les paiements sont traités par Stripe, l'un des prestataires de paiement en ligne les plus utilisés au monde.",
      },
      {
        question: "Comment utiliser un code promo ?",
        answer: "Entrez votre code dans le champ prévu sur la page panier, avant de valider votre commande.",
      },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        question: "Comment vous contacter ?",
        answer:
          "Via le chat en direct (bouton en bas à droite du site) ou le formulaire de contact. Notre équipe vous répond sous 24 à 48 h.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#edf4ff] font-[family-name:var(--font-inter)]">
      <PromoBanner />

      <header className="border-b border-blue-100 bg-white/90">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold text-blue-950 hover:text-blue-700">
            ← Retour à la boutique
          </Link>
          <Link href="/" className="hover:opacity-80">
            <BrandMark size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800">Aide</p>
        <h1 className="mt-2 text-3xl font-black text-blue-950">Questions fréquentes</h1>
        <p className="mt-2 text-sm text-slate-600">
          Vous ne trouvez pas de réponse ici ?{" "}
          <Link href="/contact" className="font-semibold text-blue-800 underline underline-offset-2">
            Contactez-nous
          </Link>
          .
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-blue-950">{section.title}</h2>
              <div className="divide-y divide-blue-100 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                {section.items.map((item) => (
                  <details key={item.question} className="group px-5 py-4 open:pb-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900">
                      {item.question}
                      <span className="shrink-0 text-blue-950 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
