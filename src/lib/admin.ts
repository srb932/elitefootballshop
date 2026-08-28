import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getAdmin() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, role: true },
  })
  return user?.role === "ADMIN" ? user : null
}

export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) {
    const session = await auth()
    redirect(session?.user ? "/" : "/auth/login?callbackUrl=/admin")
  }
  return admin
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
}

export function orderLabel(status: string) {
  return ({ PENDING: "En attente", PAID: "Payée", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée" } as Record<string, string>)[status] ?? status
}
