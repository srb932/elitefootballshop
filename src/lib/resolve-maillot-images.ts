import { EXISTING_MAILLOT_FILES, MAILLOT_FILE_VERSIONS } from "./image-manifest"
import type { MaillotType } from "./maillot-images"

/**
 * Ajoute la date de dernière modification du fichier en paramètre d'URL.
 * Sert à casser le cache navigateur automatiquement quand une image est
 * remplacée sous le même nom (sinon l'ancienne version peut rester affichée
 * jusqu'à un rechargement forcé).
 */
function withVersion(file: string): string {
  const version = MAILLOT_FILE_VERSIONS[file]
  return version ? `/maillots/${file}?v=${version}` : `/maillots/${file}`
}

/** Alias fichiers spéciaux (domicile 2025-26) */
const SPECIAL_FILES: Record<string, { front: string; back: string }> = {
  "paris-saint-germain|domicile|2526": { front: "psg.png", back: "psg1.png" },
  "olympique-marseille|domicile|2526": { front: "om.png", back: "om1.png" },
}

function fileExists(name: string): boolean {
  return EXISTING_MAILLOT_FILES.has(name)
}

function pairExists(front: string, back: string): boolean {
  return fileExists(front) && fileExists(back)
}

export interface ResolvedImages {
  imageFront: string
  imageBack: string
  frontFile: string
  backFile: string
  available: boolean
}

export function resolveMaillotImages(
  clubSlug: string,
  type: MaillotType,
  code: string
): ResolvedImages {
  const candidates: { front: string; back: string }[] = []

  const specialKey = `${clubSlug}|${type}|${code}`
  if (SPECIAL_FILES[specialKey]) {
    candidates.push(SPECIAL_FILES[specialKey])
  }

  candidates.push({
    front: `${clubSlug}-${type}-${code}-avant.png`,
    back: `${clubSlug}-${type}-${code}-arriere.png`,
  })

  if (type === "domicile" && code === "2526") {
    candidates.push({
      front: `${clubSlug}-avant.png`,
      back: `${clubSlug}-arriere.png`,
    })
  }

  for (const c of candidates) {
    if (pairExists(c.front, c.back)) {
      return {
        imageFront: withVersion(c.front),
        imageBack: withVersion(c.back),
        frontFile: c.front,
        backFile: c.back,
        available: true,
      }
    }
  }

  const fallback = candidates[0]
  return {
    imageFront: `/maillots/${fallback.front}`,
    imageBack: `/maillots/${fallback.back}`,
    frontFile: fallback.front,
    backFile: fallback.back,
    available: false,
  }
}

export function getExpectedImageNames(
  clubSlug: string,
  type: MaillotType,
  code: string
): { avant: string; arriere: string } {
  const resolved = resolveMaillotImages(clubSlug, type, code)
  return { avant: resolved.frontFile, arriere: resolved.backFile }
}
