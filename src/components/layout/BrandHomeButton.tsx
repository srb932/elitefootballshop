"use client"

import { useState } from "react"

export function BrandHomeButton({ onHome }: { onHome: () => void }) {
  const [returning, setReturning] = useState(false)
  function goHome() {
    if (returning) return
    setReturning(true)
    window.setTimeout(() => { onHome(); window.scrollTo({ top: 0, behavior: "smooth" }); setReturning(false) }, 180)
  }
  return <button type="button" onClick={goHome} aria-label="Retour à l'accueil L'Âme du Maillot" className={`group relative shrink-0 text-left outline-none transition-transform ${returning ? "scale-[0.98]" : ""}`}><span className="inline-block rounded-md border-2 border-blue-950 bg-blue-950 px-2 py-1 text-sm font-black uppercase italic leading-none tracking-tight text-white shadow-sm transition group-hover:bg-white group-hover:text-blue-950 sm:px-2.5 sm:text-base">L&apos;ÂME DU MAILLOT</span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.17em] text-slate-500 sm:text-[9px]">Le repaire du supporter</span><span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-950 transition-all duration-200 group-hover:w-full" /></button>
}
