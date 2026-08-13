"use client"

import { useSession, signOut } from "next-auth/react"

const navBtn =
  "px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-700 border border-gray-200 rounded-lg hover:border-blue-950 hover:text-blue-950 hover:bg-gray-50 transition-all duration-200"

export function AuthNav({ onLoginClick }: { onLoginClick: () => void }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-[88px] h-9 rounded-lg bg-gray-100 animate-pulse" />
  }

  if (session) {
    const displayName = session.user?.name || session.user?.email || "Mon compte"

    return (
      <div className="flex items-center gap-2">
        <span
          className={`${navBtn} text-blue-950 bg-gray-50 cursor-default max-w-[120px] truncate`}
          title={displayName}
        >
          {displayName}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={navBtn}
        >
          Déconnexion
        </button>
      </div>
    )
  }

  return (
    <button type="button" onClick={onLoginClick} className={navBtn}>
      Connexion
    </button>
  )
}
