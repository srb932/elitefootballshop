import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const maillotsDir = path.join(__dirname, "../public/maillots")

const files = fs
  .readdirSync(maillotsDir)
  .filter((f) => !f.startsWith(".") && f !== "GUIDE-IMAGES.md")

const content = `/** Généré automatiquement — lance: node scripts/generate-image-manifest.mjs */
export const EXISTING_MAILLOT_FILES = new Set<string>([
${files.map((f) => `  ${JSON.stringify(f)},`).join("\n")}
])
`

fs.writeFileSync(path.join(__dirname, "../src/lib/image-manifest.ts"), content)
console.log(`Manifest: ${files.length} fichiers`)
