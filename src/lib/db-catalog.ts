import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/products"
import { CUSTOM_LEAGUES, type CustomLeague } from "@/lib/clubs"
import type { Maillot, MaillotType } from "@/types/product"
import type { Club, League, Product } from "@prisma/client"

export { CUSTOM_LEAGUES, type CustomLeague }

export function isCustomLeague(league: string): league is CustomLeague {
  return (CUSTOM_LEAGUES as readonly string[]).includes(league)
}

const CUSTOM_PRODUCT_PREFIX = "custom-"

export function toCustomProductId(dbId: string) {
  return `${CUSTOM_PRODUCT_PREFIX}${dbId}`
}

export function fromCustomProductId(id: string): string | null {
  return id.startsWith(CUSTOM_PRODUCT_PREFIX) ? id.slice(CUSTOM_PRODUCT_PREFIX.length) : null
}

type ProductWithClub = Product & { club: Club & { league: League } }

function toMaillot(product: ProductWithClub): Maillot {
  const [imageFront, imageBack] = product.images
  const typeByLabel: Record<string, MaillotType> = { Domicile: "domicile", Extérieur: "exterieur", Third: "third" }

  // Un prix barré volontairement plus haut que le prix de vente = promo
  // décidée par l'admin (contrairement au catalogue "code", ici il n'y a
  // pas de calcul automatique : c'est le champ "Prix barré" du formulaire).
  const isPromo = Boolean(product.oldPrice && product.oldPrice > product.price)

  return {
    id: toCustomProductId(product.id),
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice ?? product.price,
    league: product.club.league.name,
    club: product.club.name,
    clubSlug: product.club.slug,
    type: typeByLabel[product.typeLabel] ?? "domicile",
    typeLabel: product.typeLabel,
    saison: product.saison,
    badge: isPromo ? "PROMO" : "",
    section: isPromo ? "promo" : undefined,
    available: Boolean(imageFront && imageBack) && product.isActive,
    imageFront: imageFront ?? "/maillots/placeholder-front.svg",
    imageBack: imageBack ?? "/maillots/placeholder-back.svg",
    frontFile: imageFront ?? "",
    backFile: imageBack ?? "",
  }
}

/** Tous les maillots personnalisés (Pays/Nations, Autre...) prêts à afficher sur la boutique. */
export async function getCustomMaillots(): Promise<Maillot[]> {
  const products = await prisma.product.findMany({
    where: { club: { league: { name: { in: [...CUSTOM_LEAGUES] } } }, isActive: true },
    include: { club: { include: { league: true } } },
    orderBy: { createdAt: "desc" },
  })
  return products.map(toMaillot)
}

export async function getCustomMaillotById(dbId: string): Promise<Maillot | null> {
  const product = await prisma.product.findUnique({
    where: { id: dbId },
    include: { club: { include: { league: true } } },
  })
  return product ? toMaillot(product) : null
}

async function getOrCreateLeague(name: string) {
  return prisma.league.upsert({
    where: { name },
    update: {},
    create: { name, slug: slugify(name) },
  })
}

async function getOrCreateClub(name: string, leagueId: string) {
  const slug = slugify(name)
  const existing = await prisma.club.findUnique({ where: { slug } })
  if (existing && existing.leagueId === leagueId) return existing
  if (existing) return prisma.club.update({ where: { id: existing.id }, data: { leagueId, name } })
  return prisma.club.create({ data: { name, slug, leagueId } })
}

export interface CustomProductInput {
  league: CustomLeague
  clubName: string
  name: string
  price: number
  oldPrice: number | null
  typeLabel: string
  saison: string
  imageFront: string
  imageBack: string
}

export async function createCustomProduct(input: CustomProductInput) {
  const league = await getOrCreateLeague(input.league)
  const club = await getOrCreateClub(input.clubName, league.id)
  const baseSlug = slugify(`${input.clubName}-${input.name}-${Date.now()}`)

  return prisma.product.create({
    data: {
      name: input.name,
      slug: baseSlug,
      price: input.price,
      oldPrice: input.oldPrice,
      images: [input.imageFront, input.imageBack],
      description: `${input.typeLabel} · ${input.saison}`.trim(),
      typeLabel: input.typeLabel,
      saison: input.saison,
      clubId: club.id,
    },
  })
}

export interface CustomProductUpdate {
  name: string
  price: number
  oldPrice: number | null
  typeLabel: string
  saison: string
}

export async function updateCustomProduct(dbId: string, input: CustomProductUpdate) {
  await prisma.product.update({
    where: { id: dbId },
    data: {
      name: input.name,
      price: input.price,
      oldPrice: input.oldPrice,
      typeLabel: input.typeLabel,
      saison: input.saison,
      description: `${input.typeLabel} · ${input.saison}`.trim(),
    },
  })
}

export async function deleteCustomProduct(dbId: string) {
  await prisma.product.delete({ where: { id: dbId } })
}
