import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const maillotsDir = path.join(__dirname, "../public/maillots")

const files = fs
  .readdirSync(maillotsDir)
  .filter((f) => !f.startsWith(".") && f !== "GUIDE-IMAGES.md")

// Horodatage de dernière modification par fichier : utilisé pour "casser" le
// cache navigateur/Next.js quand une image est remplacée sous le même nom
// (voir resolve-maillot-images.ts) — sans ça, une image mise à jour peut
// rester affichée telle quelle tant que le cache n'expire pas.
const fileVersions = Object.fromEntries(
  files.map((f) => [f, Math.floor(fs.statSync(path.join(maillotsDir, f)).mtimeMs)])
)

const content = `/** Généré automatiquement — lance: node scripts/generate-image-manifest.mjs */
export const EXISTING_MAILLOT_FILES = new Set<string>([
${files.map((f) => `  ${JSON.stringify(f)},`).join("\n")}
])

/** Dernière modification (ms) de chaque fichier — sert à invalider le cache d'image. */
export const MAILLOT_FILE_VERSIONS: Record<string, number> = ${JSON.stringify(fileVersions, null, 2)}
`

fs.writeFileSync(path.join(__dirname, "../src/lib/image-manifest.ts"), content)
console.log(`Manifest: ${files.length} fichiers`)
