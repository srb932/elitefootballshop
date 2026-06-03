import Link from "next/link"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-black text-gray-900 uppercase">Maillot introuvable</h1>
      <Link href="/" className="mt-4 text-sm font-bold text-blue-950 hover:underline">
        ← Retour au catalogue
      </Link>
    </div>
  )
}
