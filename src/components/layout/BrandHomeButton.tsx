"use client"

import { useState } from "react"
import { BrandMark } from "@/components/layout/BrandMark"

export function BrandHomeButton({ onHome }: { onHome: () => void }) {
  const [returning, setReturning] = useState(false)
  function goHome() {
    if (returning) return
    setReturning(true)
    window.setTimeout(() => { onHome(); window.scrollTo({ top: 0, behavior: "smooth" }); setReturning(false) }, 180)
  }
  return (
    <button
      type="button"
      onClick={goHome}
      aria-label="Retour à l'accueil L'Âme du Maillot"
      className={`group shrink-0 text-left outline-none transition-transform ${returning ? "scale-[0.98]" : ""} hover:opacity-80`}
    >
      <BrandMark />
    </button>
  )
}
