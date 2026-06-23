export type MaillotType = "domicile" | "exterieur" | "third"

export interface MaillotVariantDef {
  type: MaillotType
  saison: string
  code: string
  typeLabel: string
}

/** Tous les maillots générés par club */
export const MAILLOT_VARIANTS: MaillotVariantDef[] = [
  { type: "domicile", saison: "2025-26", code: "2526", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2025-26", code: "2526", typeLabel: "Extérieur" },
  { type: "third", saison: "2025-26", code: "2526", typeLabel: "Third" },
  { type: "domicile", saison: "2024-25", code: "2425", typeLabel: "Domicile" },
  { type: "exterieur", saison: "2024-25", code: "2425", typeLabel: "Extérieur" },
  { type: "domicile", saison: "2023-24", code: "2324", typeLabel: "Domicile" },
]

export const IMAGE_GUIDE = {
  dossierMaillots: "public/maillots/",
  dossierLogos: "public/logos/",
  regles: [
    "Format standard : {clubSlug}-{type}-{saison}-avant.png et ...-arriere.png",
    "Types : domicile | exterieur | third",
    "Saisons : 2526 (2025-26), 2425 (2024-25), 2324 (2023-24)",
    "Ancien format (domicile 2025-26) : {clubSlug}-avant.png / {clubSlug}-arriere.png",
    "Alias PSG : psg.png + psg1.png | Alias OM : om.png + om1.png",
    "Logos clubs : public/logos/{clubSlug}.png ou .svg",
  ],
  exemples: [
    { club: "Paris Saint-Germain", slug: "paris-saint-germain", avant: "paris-saint-germain-domicile-2526-avant.png", arriere: "paris-saint-germain-domicile-2526-arriere.png" },
    { club: "Real Madrid", slug: "real-madrid", avant: "real-madrid-domicile-2526-avant.png", arriere: "real-madrid-domicile-2526-arriere.png" },
    { club: "Real Madrid (ancien)", slug: "real-madrid", avant: "real-madrid-avant.png", arriere: "real-madrid-arriere.png" },
  ],
}
