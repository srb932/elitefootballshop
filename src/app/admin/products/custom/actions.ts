"use server"

import { revalidatePath } from "next/cache"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import {
  CUSTOM_LEAGUES,
  createCustomProduct,
  deleteCustomProduct,
  fromCustomProductId,
  updateCustomProduct,
  type CustomLeague,
} from "@/lib/db-catalog"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "custom")

async function saveImage(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png"
  const filename = `${crypto.randomUUID()}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, filename), bytes)
  return `/uploads/custom/${filename}`
}

function parseLeague(value: FormDataEntryValue | null): CustomLeague {
  const league = CUSTOM_LEAGUES.find((l) => l === value)
  if (!league) throw new Error("Catégorie invalide.")
  return league
}

export async function createCustomProductAction(formData: FormData) {
  const admin = await requireAdmin()

  const clubName = String(formData.get("clubName") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const price = Number(formData.get("price"))
  const oldPriceRaw = String(formData.get("oldPrice") || "").trim()
  const typeLabel = String(formData.get("typeLabel") || "Domicile")
  const saison = String(formData.get("saison") || "").trim()
  const league = parseLeague(formData.get("league"))
  const imageFrontFile = formData.get("imageFront") as File | null
  const imageBackFile = formData.get("imageBack") as File | null

  if (!clubName || !name || !Number.isFinite(price) || price <= 0) {
    throw new Error("Nom, équipe et prix sont obligatoires.")
  }
  if (!imageFrontFile || !imageFrontFile.size || !imageBackFile || !imageBackFile.size) {
    throw new Error("Les deux images (avant/arrière) sont obligatoires.")
  }

  const [imageFront, imageBack] = await Promise.all([saveImage(imageFrontFile), saveImage(imageBackFile)])

  const product = await createCustomProduct({
    league,
    clubName,
    name,
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : null,
    typeLabel,
    saison,
    imageFront,
    imageBack,
  })

  await prisma.adminActivity.create({
    data: { actorId: admin.id, action: `Maillot personnalisé créé : ${name}`, entityType: "Product", entityId: product.id },
  })

  revalidatePath("/")
  revalidatePath("/admin/products/custom")
}

export async function updateCustomProductAction(productId: string, formData: FormData) {
  const admin = await requireAdmin()
  const dbId = fromCustomProductId(productId) ?? productId

  const name = String(formData.get("name") || "").trim()
  const price = Number(formData.get("price"))
  const oldPriceRaw = String(formData.get("oldPrice") || "").trim()
  const typeLabel = String(formData.get("typeLabel") || "Domicile")
  const saison = String(formData.get("saison") || "").trim()

  if (!name || !Number.isFinite(price) || price <= 0) {
    throw new Error("Nom et prix sont obligatoires.")
  }

  await updateCustomProduct(dbId, {
    name,
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : null,
    typeLabel,
    saison,
  })

  await prisma.adminActivity.create({
    data: { actorId: admin.id, action: `Maillot personnalisé modifié : ${name}`, entityType: "Product", entityId: dbId },
  })

  revalidatePath("/")
  revalidatePath("/admin/products/custom")
}

export async function deleteCustomProductAction(productId: string) {
  const admin = await requireAdmin()
  const dbId = fromCustomProductId(productId) ?? productId

  await deleteCustomProduct(dbId)

  await prisma.adminActivity.create({
    data: { actorId: admin.id, action: "Maillot personnalisé supprimé", entityType: "Product", entityId: dbId },
  })

  revalidatePath("/")
  revalidatePath("/admin/products/custom")
}
