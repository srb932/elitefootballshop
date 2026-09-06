import Image from "next/image"

// public/logo-v2.png (1335x618, fond transparent) — logo officiel fourni par
// le client, détouré pour se fondre dans le fond clair du site.
const LOGO_RATIO = 1335 / 618

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const height = size === "sm" ? 40 : 52
  const width = Math.round(height * LOGO_RATIO)

  return (
    <Image
      src="/logo-v2.png"
      alt="L'Âme du Maillot"
      width={width}
      height={height}
      priority
      className="h-auto"
      style={{ width, height }}
    />
  )
}
