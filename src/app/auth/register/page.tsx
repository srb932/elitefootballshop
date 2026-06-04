"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Inscription impossible.")
      return
    }

    await signIn("credentials", { email, password, callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg border border-gray-200 shadow-sm p-6">
        <Link href="/" className="text-xs font-bold text-blue-950 hover:underline">
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="text-2xl font-black uppercase text-gray-900 mt-4 mb-1">Inscription</h1>
        <p className="text-sm text-gray-500 mb-6">Créez votre compte en quelques secondes</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 block mb-1">Prénom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-600 block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-blue-950"
            />
          </div>

          {error && <p className="text-red-600 text-xs font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-gray-900 disabled:opacity-60 text-white text-sm font-bold uppercase py-3 rounded-md"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border border-gray-300 text-gray-800 text-sm font-semibold py-3 rounded-md hover:border-gray-400"
        >
          S&apos;inscrire avec Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="font-bold text-blue-950 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
