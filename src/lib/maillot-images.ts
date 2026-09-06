export type MaillotType = "domicile" | "exterieur" | "third"

export interface MaillotVariantDef {
  type: MaillotType
  saison: string
  code: string
  typeLabel: string
}

/**
 * Tous les maillots générés par club.
 * La saison 2026-27 (domicile + extérieur) a été ajoutée pour la saison en
 * cours : les emplacements existent dès maintenant, il suffit d'y déposer
 * les images (voir IMAGE_GUIDE ci-dessous) pour qu'un maillot apparaisse
 * automatiquement dans le catalogue et soit éligible aux mises en avant
 * "Nouveautés". Rien n'est retiré des saisons précédentes.
 */
export const MAILLOT_VARIANTS: MaillotVariantDef[] = [
  { type: "domicile", saison: "2026-27", code: "2627", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2026-27", code: "2627", typeLabel: "Extérieur" },
  { type: "domicile", saison: "2025-26", code: "2526", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2025-26", code: "2526", typeLabel: "Extérieur" },
  { type: "third", saison: "2025-26", code: "2526", typeLabel: "Third" },
  { type: "domicile", saison: "2024-25", code: "2425", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2024-25", code: "2425", typeLabel: "Extérieur" },
  { type: "domicile", saison: "2023-24", code: "2324", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2022-23", code: "2223", typeLabel: "Extérieur" },
]

/** Code saison le plus récent — sert de référence pour repérer les "Nouveautés". */
export const CURRENT_SEASON_CODE = "2627"

export const IMAGE_GUIDE = {
  dossierMaillots: "public/maillots/",
  dossierLogos: "public/logos/",
  regles: [
    "Format standard : {clubSlug}-{type}-{saison}-avant.png et ...-arriere.png",
    "Types : domicile | exterieur | third",
    "Saisons : 2627 (2026-27, actuelle), 2526 (2025-26), 2425 (2024-25), 2324 (2023-24), 2223 (2022-23)",
    "Ancien format (domicile 2025-26) : {clubSlug}-avant.png / {clubSlug}-arriere.png",
    "Alias PSG : psg.png + psg1.png | Alias OM : om.png + om1.png",
    "Logos clubs : public/logos/{clubSlug}.png ou .svg",
  ],
  exemples: [
    { club: "Paris Saint-Germain (2026-27)", slug: "paris-saint-germain", avant: "paris-saint-germain-domicile-2627-avant.png", arriere: "paris-saint-germain-domicile-2627-arriere.png" },
    { club: "Real Madrid", slug: "real-madrid", avant: "real-madrid-domicile-2526-avant.png", arriere: "real-madrid-domicile-2526-arriere.png" },
    { club: "Real Madrid (ancien)", slug: "real-madrid", avant: "real-madrid-avant.png", arriere: "real-madrid-arriere.png" },
  ],
}
