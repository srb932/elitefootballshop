"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { setProductHighlight } from "@/lib/product-highlights"
import { prisma } from "@/lib/prisma"
import type { ProductSection } from "@/types/product"

export async function setHighlight(
  productId: string,
  section: ProductSection | null,
  hidden: boolean
) {
  const admin = await requireAdmin()
  await setProductHighlight(productId, { section, hidden })
  await prisma.adminActivity.create({
    data: {
      actorId: admin.id,
      action: hidden
        ? "Maillot masqué des mises en avant"
        : section
          ? `Maillot épinglé en "${section}"`
          : "Mise en avant réinitialisée (automatique)",
      entityType: "ProductHighlight",
      entityId: productId,
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/products")
}
