import Link from "next/link"
import { PromoBanner } from "@/components/catalog/PromoBanner"
import { getImageGuideEntries } from "@/lib/products"
import { IMAGE_GUIDE } from "@/lib/maillot-images"

export default function GuideMaillotsPage() {
  const entries = getImageGuideEntries()
  const missing = entries.filter((e) => !e.available)
  const present = entries.filter((e) => e.available)

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-[family-name:var(--font-inter)]">
      <PromoBanner />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-blue-950 hover:underline">
            ← Retour à la boutique
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-950">
            Contact
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Guide des images maillots</h1>
        <p className="text-sm text-gray-600 mb-8">
          Voici comment nommer et où placer vos fichiers pour que les maillots s&apos;affichent automatiquement sur le site.
        </p>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dossiers</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>Maillots :</strong>{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{IMAGE_GUIDE.dossierMaillots}</code>
            </li>
            <li>
              <strong>Logos clubs :</strong>{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{IMAGE_GUIDE.dossierLogos}</code>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Règles de nommage</h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            {IMAGE_GUIDE.regles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-950">
            <p className="font-medium mb-2">Exemple pour le PSG — Domicile 2025-26 :</p>
            <code className="block text-xs">paris-saint-germain-domicile-2526-avant.png</code>
            <code className="block text-xs mt-1">paris-saint-germain-domicile-2526-arriere.png</code>
            <p className="mt-2 text-xs text-blue-800">Ou alias : psg.png + psg1.png</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Maillots déjà détectés ({present.length})
          </h2>
          <p className="text-xs text-gray-500 mb-4">Ces paires avant/arrière sont présentes dans le dossier.</p>
          <div className="max-h-64 overflow-y-auto text-xs font-mono space-y-1 text-green-700">
            {present.slice(0, 50).map((e) => (
              <div key={`${e.clubSlug}-${e.type}-${e.saison}`}>
                ✓ {e.avant} + {e.arriere}
              </div>
            ))}
            {present.length > 50 && <p className="text-gray-400 pt-2">… et {present.length - 50} autres</p>}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Maillots à ajouter ({missing.length})
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Renommez vos fichiers exactement comme ci-dessous et glissez-les dans{" "}
            <code className="bg-gray-100 px-1 rounded">public/maillots/</code>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Club</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Saison</th>
                  <th className="py-2 pr-4">Fichier avant</th>
                  <th className="py-2">Fichier arrière</th>
                </tr>
              </thead>
              <tbody>
                {missing.slice(0, 100).map((e) => (
                  <tr key={`${e.clubSlug}-${e.type}-${e.saison}`} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-medium text-gray-800">{e.club}</td>
                    <td className="py-2 pr-4 text-gray-600">{e.type}</td>
                    <td className="py-2 pr-4 text-gray-600">{e.saison}</td>
                    <td className="py-2 pr-4 font-mono text-gray-700">{e.avant}</td>
                    <td className="py-2 font-mono text-gray-700">{e.arriere}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {missing.length > 100 && (
              <p className="text-gray-400 text-xs mt-4">… {missing.length - 100} autres entrées</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Après avoir ajouté des images, relancez :{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded">node scripts/generate-image-manifest.mjs</code>
          </p>
        </section>
      </main>
    </div>
  )
}
