import type { Maillot, ProductSection } from "@/types/product"

/**
 * Clubs qui génèrent le plus d'intérêt en ce moment (actualité, transferts,
 * audience) — signal éditorial utilisé pour les sections "À la une" /
 * "Tendances". Liste à ajuster au fil de la saison selon l'actualité du
 * football. Elle n'influence jamais la disponibilité réelle d'un produit :
 * seuls les maillots dont l'image a été importée peuvent être mis en avant,
 * et aucun produit n'est jamais inventé pour remplir une section.
 */
export const HOT_CLUBS: string[] = [
  // Les 4 premiers alimentent "À la une" (vainqueur Ligue des Champions,
  // reconstruction post-Guardiola, championne d'Espagne, retour Mourinho...).
  "Paris Saint-Germain",
  "Manchester City",
  "FC Barcelona",
  "Real Madrid",
  // Les suivants alimentent "Tendances".
  "Arsenal",
  "Liverpool FC",
  "Bayern Munich",
  "Chelsea FC",
  "Tottenham Hotspur",
  "Inter Milan",
  "SSC Napoli",
  "Atlético Madrid",
  "AC Milan",
  "Juventus FC",
  "AS Monaco",
  "Manchester United",
  "Borussia Dortmund",
  "Olympique Marseille",
  "AS Roma",
  "Bayer Leverkusen",
]

const SECTION_LIMITS: Record<ProductSection, number> = {
  vedette: 4,
  tendance: 8,
  nouveau: 8,
  promo: 8,
}

const BADGE_LABEL: Record<ProductSection, string> = {
  vedette: "VEDETTE",
  tendance: "TENDANCE",
  nouveau: "NOUVEAU",
  promo: "PROMO",
}

/** "2025-26" -> "2526" (comparable numériquement, du plus ancien au plus récent). */
function seasonCode(saison: string): string {
  const [first, second] = saison.split("-")
  return `${first?.slice(-2) ?? ""}${second ?? ""}`
}

const typeWeight: Record<Maillot["type"], number> = { domicile: 2, exterieur: 1, third: 0 }

/** Le maillot le plus représentatif d'un club parmi ses produits disponibles : le plus récent, domicile en priorité. */
export function flagship(products: Maillot[]): Maillot | undefined {
  return [...products]
    .filter((p) => p.available)
    .sort((a, b) => {
      const seasonDiff = Number(seasonCode(b.saison)) - Number(seasonCode(a.saison))
      if (seasonDiff !== 0) return seasonDiff
      return typeWeight[b.type] - typeWeight[a.type]
    })[0]
}

function newestAvailableSeasonCode(products: Maillot[]): string {
  let best = "0"
  for (const p of products) {
    if (!p.available) continue
    const code = seasonCode(p.saison)
    if (Number(code) > Number(best)) best = code
  }
  return best
}

/**
 * Calcule automatiquement les sections "À la une / Tendances / Nouveautés /
 * Promos" à partir du catalogue réellement disponible (images importées) :
 * un seul maillot phare par club et par section, pour garder de la variété.
 * N'invente jamais de produit — se contente d'annoter `.section` / `.badge`.
 */
export function deriveAutoSections(products: Maillot[]): Maillot[] {
  const byClub = new Map<string, Maillot[]>()
  for (const p of products) {
    const list = byClub.get(p.club)
    if (list) list.push(p)
    else byClub.set(p.club, [p])
  }

  const flagshipByClub = new Map<string, Maillot>()
  for (const [club, list] of byClub) {
    const f = flagship(list)
    if (f) flagshipByClub.set(club, f)
  }

  const sectionById = new Map<string, ProductSection>()
  const usedClubs = new Set<string>()

  function tryAssign(section: ProductSection, club: string): boolean {
    if (usedClubs.has(club)) return false
    const p = flagshipByClub.get(club)
    if (!p) return false
    sectionById.set(p.id, section)
    usedClubs.add(club)
    return true
  }

  // 1. À la une : les tout premiers clubs de la liste "chaude" du moment.
  let vedetteCount = 0
  for (const club of HOT_CLUBS) {
    if (vedetteCount >= SECTION_LIMITS.vedette) break
    if (tryAssign("vedette", club)) vedetteCount++
  }

  // 2. Tendances : le reste des clubs qui génèrent de l'intérêt.
  let tendanceCount = 0
  for (const club of HOT_CLUBS) {
    if (tendanceCount >= SECTION_LIMITS.tendance) break
    if (tryAssign("tendance", club)) tendanceCount++
  }

  // 3. Nouveautés : maillots de la saison la plus récente disponible.
  const newestCode = newestAvailableSeasonCode(products)
  const newest = [...flagshipByClub.values()].filter((p) => seasonCode(p.saison) === newestCode)
  let nouveauCount = 0
  for (const p of newest) {
    if (nouveauCount >= SECTION_LIMITS.nouveau) break
    if (tryAssign("nouveau", p.club)) nouveauCount++
  }

  // 4. Promos : le reste des clubs, en priorisant les maillots des saisons
  //    plus anciennes (stock à écouler en premier).
  const rest = [...flagshipByClub.values()]
    .filter((p) => !usedClubs.has(p.club))
    .sort((a, b) => Number(seasonCode(a.saison)) - Number(seasonCode(b.saison)))
  let promoCount = 0
  for (const p of rest) {
    if (promoCount >= SECTION_LIMITS.promo) break
    if (tryAssign("promo", p.club)) promoCount++
  }

  return products.map((p) => {
    const section = sectionById.get(p.id)
    return section ? { ...p, section, badge: BADGE_LABEL[section] } : p
  })
}

export interface ProductOverride {
  /** Section imposée par l'admin, ou `null` pour laisser le calcul automatique décider. */
  section: ProductSection | null
  /** Masque le produit des mises en avant (il reste en vente sur sa page club). */
  hidden: boolean
}

/**
 * Applique les choix de l'admin (épinglage / masquage) par-dessus les
 * sections calculées automatiquement.
 */
export function applyOverrides(products: Maillot[], overrides: Map<string, ProductOverride>): Maillot[] {
  if (!overrides.size) return products
  return products.map((p) => {
    const override = overrides.get(p.id)
    if (!override) return p
    if (override.hidden) return { ...p, section: undefined, badge: "" }
    if (override.section) return { ...p, section: override.section, badge: BADGE_LABEL[override.section] }
    return p
  })
}
