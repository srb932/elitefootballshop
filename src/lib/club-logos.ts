import { slugify } from "./products"

/** * Abréviations officielles affichées si le logo PNG n'existe pas encore 
 * Couvre l'intégralité des clubs (Ligue 1, Ligue 2, Premier League, La Liga, Serie A)
 */
const SHORT_NAMES: Record<string, string> = {
  // ==========================================
  // LIGUE 1
  // ==========================================
  "paris-saint-germain": "PSG",
  "olympique-marseille": "OM",
  "as-monaco": "ASM",
  "olympique-lyonnais": "OL",
  "lille-osc": "LOSC",
  "ogc-nice": "OGCN",
  "rc-lens": "RCL",
  "stade-rennais": "SRFC",
  "rc-strasbourg": "RCSA",
  "toulouse-fc": "TFC",
  "stade-brestois": "SB29",
  "fc-nantes": "FCN",
  "stade-de-reims": "SDR",
  "aj-auxerre": "AJA",
  "angers-sco": "SCO",
  "le-havre-ac": "HAC",
  "as-saint-etienne": "ASSE",
  "montpellier-hsc": "MHSC",

  // ==========================================
  // LIGUE 2
  // ==========================================
  "paris-fc": "PFC",
  "fc-lorient": "FCL",
  "fc-metz": "FCM",
  "estac-troyes": "ESTAC",
  "stade-lavallois": "LAVAL",
  "ac-ajaccio": "ACA",
  "pau-fc": "PAU",
  "rodez-af": "RAF",
  "amiens-sc": "ASC",
  "en-avant-guingamp": "EAG",
  "sc-bastia": "SCB",
  "usl-dunkerque": "USLD",
  "annecy-fc": "FCA",
  "red-star-fc": "RED",
  "fc-martigues": "FCM",
  "clermont-foot": "CF63",
  "grenoble-foot-38": "GF38",
  "sm-caen": "SMC",
  "us-boulogne": "USBCO",
  "valenciennes-fc": "VAFC",

  // ==========================================
  // PREMIER LEAGUE
  // ==========================================
  "arsenal": "ARS",
  "aston-villa": "AVL",
  "afc-bournemouth": "BOU",
  "brentford-fc": "BRE",
  "brighton-hove-albion": "BHA",
  "chelsea-fc": "CHE",
  "crystal-palace": "CRY",
  "everton-fc": "EVE",
  "fulham-fc": "FUL",
  "ipswich-town": "IPS",
  "leicester-city": "LEI",
  "liverpool-fc": "LFC",
  "manchester-city": "MCI",
  "manchester-united": "MUN",
  "newcastle-united": "NEW",
  "nottingham-forest": "NFO",
  "southampton-fc": "SOU",
  "tottenham-hotspur": "TOT",
  "west-ham-united": "WHU",
  "wolverhampton-wanderers": "WOL",

  // ==========================================
  // LA LIGA
  // ==========================================
  "real-madrid": "RMA",
  "fc-barcelona": "FCB",
  "atletico-madrid": "ATM",
  "sevilla-fc": "SEV",
  "real-sociedad": "RSO",
  "villarreal-cf": "VIL",
  "real-betis": "BET",
  "valencia-cf": "VAL",
  "athletic-club": "ATH",
  "ca-osasuna": "OSA",
  "getafe-cf": "GET",
  "girona-fc": "GIR",
  "rcd-mallorca": "MLL",
  "rayo-vallecano": "RAY",
  "rc-celta-de-vigo": "CEL",
  "ud-las-palmas": "LPA",
  "deportivo-alaves": "ALA",
  "real-valladolid": "VLD",
  "rcd-espanyol": "ESP",
  "cd-leganes": "LEG",

  // ==========================================
  // SERIE A
  // ==========================================
  "inter-milan": "INT",
  "ac-milan": "ACM",
  "juventus-fc": "JUV",
  "ssc-napoli": "NAP",
  "as-roma": "ROM",
  "ss-lazio": "LAZ",
  "atalanta-bc": "ATA",
  "acf-fiorentina": "FIO",
  "bologna-fc": "BOL",
  "torino-fc": "TOR",
  "ac-monza": "MON",
  "genoa-cfc": "GEN",
  "udinese-calcio": "UDI",
  "hellas-verona": "VER",
  "us-lecce": "LEC",
  "cagliari-calcio": "CAG",
  "empoli-fc": "EMP",
  "parma-calcio": "PAR",
  "venezia-fc": "VEN",
  "como-1907": "COM",
}

export function getClubLogoPath(clubSlug: string): string {
  return `/logos/${clubSlug}.png`
}

export function getClubShortName(clubSlug: string, fullName: string): string {
  if (SHORT_NAMES[clubSlug]) return SHORT_NAMES[clubSlug]
  const words = fullName.split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function getClubSlugFromName(name: string): string {
  return slugify(name)
}