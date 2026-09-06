import { prisma } from "@/lib/prisma"
import type { ProductOverride } from "@/lib/trending"
import type { ProductSection } from "@/types/product"

/** Charge les mises en avant manuelles de l'admin, indexées par id de maillot. */
export async function getProductOverrides(): Promise<Map<string, ProductOverride>> {
  const rows = await prisma.productHighlight.findMany()
  const map = new Map<string, ProductOverride>()
  for (const row of rows) {
    map.set(row.productId, { section: (row.section as ProductSection | null) ?? null, hidden: row.hidden })
  }
  return map
}

export async function setProductHighlight(
  productId: string,
  data: { section: ProductSection | null; hidden: boolean }
) {
  if (!data.section && !data.hidden) {
    await prisma.productHighlight.deleteMany({ where: { productId } })
    return
  }
  await prisma.productHighlight.upsert({
    where: { productId },
    create: { productId, section: data.section, hidden: data.hidden },
    update: { section: data.section, hidden: data.hidden },
  })
}
