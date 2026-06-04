import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const images = fs.readFileSync(path.join(__dirname, "club-images-output.txt"), "utf8")

const footer = `
const SECTION_BY_CLUB: Record<string, ProductSection> = {
  "Paris Saint-Germain": "vedette",
  "Real Madrid": "tendance",
  "FC Barcelona": "tendance",
  "Liverpool FC": "tendance",
  "Olympique Marseille": "nouveau",
  "AS Monaco": "nouveau",
  "Olympique Lyonnais": "promo",
  Arsenal: "promo",
  "Manchester City": "promo",
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function getClubImagePaths(clubSlug: string): { imageFront: string; imageBack: string } {
  return (
    CLUB_IMAGES[clubSlug] ?? {
      imageFront: "/maillots/placeholder-front.svg",
      imageBack: "/maillots/placeholder-back.svg",
    }
  )
}

function buildMaillot(league: string, club: string): Maillot {
  const clubSlug = slugify(club)
  const images = getClubImagePaths(clubSlug)
  const section = SECTION_BY_CLUB[club]
  const id = \`\${slugify(league)}-\${clubSlug}\`

  const badgeMap: Record<ProductSection, string> = {
    vedette: "VEDETTE",
    tendance: "TENDANCE",
    nouveau: "NOUVEAU",
    promo: "PROMO",
  }

  return {
    id,
    name: \`Maillot \${club} Domicile 2026\`,
    price: section === "promo" ? 39 : 45,
    oldPrice: 89.99,
    league,
    club,
    clubSlug,
    badge: section ? badgeMap[section] : "",
    section,
    imageFront: images.imageFront,
    imageBack: images.imageBack,
  }
}

export const MOCK_MAILLOTS: Maillot[] = Object.entries(CLUBS_BY_LEAGUE).flatMap(
  ([league, clubs]) => clubs.map((club) => buildMaillot(league, club))
)

export function getProductById(id: string): Maillot | undefined {
  return MOCK_MAILLOTS.find((p) => p.id === id)
}

export function getProductsBySection(section: ProductSection): Maillot[] {
  return MOCK_MAILLOTS.filter((p) => p.section === section)
}
`

const header = `/**
 * Chemins des images — place les fichiers dans public/maillots/
 * PSG : psg.png / psg1.png — OM : om.png / om1.png
 * Autres clubs : {slug}-avant.png / {slug}-arriere.png (voir CLUB_IMAGES)
 */
import { CLUBS_BY_LEAGUE } from "./clubs"
import type { Maillot, ProductSection } from "@/types/product"

/** Tous les clubs du site — 98 équipes */
export const CLUB_IMAGES: Record<string, { imageFront: string; imageBack: string }> = {
`

const content = header + images + "}\n" + footer
fs.writeFileSync(path.join(__dirname, "../src/lib/products.ts"), content)
console.log("products.ts written")
