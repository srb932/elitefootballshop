"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function setUserRoleAction(userId: string, role: "ADMIN" | "USER") {
  const admin = await requireAdmin()

  if (userId === admin.id && role === "USER") {
    throw new Error("Impossible de te retirer tes propres droits admin depuis cette page.")
  }

  const target = await prisma.user.update({ where: { id: userId }, data: { role } })

  await prisma.adminActivity.create({
    data: {
      actorId: admin.id,
      action: role === "ADMIN"
        ? `${target.name || target.email} promu administrateur`
        : `${target.name || target.email} rétrogradé utilisateur`,
      entityType: "User",
      entityId: userId,
    },
  })

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath("/admin/users")
}
