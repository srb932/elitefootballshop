"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoading(false)
      setError(data.error || "Inscription impossible.")
      return
    }

    setSuccess("Compte créé avec succès ! Connexion en cours...")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Compte créé, mais connexion automatique impossible. Connectez-vous manuellement.")
      setSuccess(null)
      return
    }

    window.location.href = "/?auth=register"
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
            <label className="text-xs font-bold uppercase text-gray-600 block mb-1">Nom d&apos;utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              placeholder="Votre pseudo"
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
          {success && <p className="text-emerald-600 text-xs font-medium">{success}</p>}

          <button
            type="submit"
            disabled={loading || !!success}
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
          onClick={() => signIn("google", { callbackUrl: "/?auth=register" })}
          disabled={loading || !!success}
          className="w-full border border-gray-300 text-gray-800 text-sm font-semibold py-3 rounded-md hover:border-gray-400 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
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
