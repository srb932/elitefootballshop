"use client"

import { useState } from "react"
import { getClubShortName } from "@/lib/club-logos"

export function ClubLogo({
  slug,
  name,
  size = 44,
}: {
  slug: string
  name: string
  size?: number
}) {
  const [srcIndex, setSrcIndex] = useState(0)
  const short = getClubShortName(slug, name)
  const sources = [`/logos/${slug}.png`, `/logos/${slug}.svg`]

  if (srcIndex < sources.length) {
    return (
      <img
        src={sources[srcIndex]}
        alt={`Logo ${name}`}
        width={size}
        height={size}
        onError={() => setSrcIndex((i) => i + 1)}
        className="rounded-full object-contain bg-white border border-gray-100 shrink-0 p-1"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-full bg-blue-950 text-white flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.28 }}
    >
      {short}
    </div>
  )
}
