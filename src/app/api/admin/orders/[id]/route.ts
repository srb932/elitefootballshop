import { getAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const input = z.object({ status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]), shippingStatus: z.enum(["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"]) })
export async function PATCH(request: Request, context: RouteContext<"/api/admin/orders/[id]">) { const admin = await getAdmin(); if (!admin) return Response.json({ error: "Accès administrateur requis" }, { status: 403 }); const { id } = await context.params; const body = input.safeParse(await request.json()); if (!body.success) return Response.json({ error: "Données invalides" }, { status: 400 }); const order = await prisma.order.update({ where: { id }, data: body.data }); await prisma.adminActivity.create({ data: { actorId: admin.id, action: "Statut de commande modifié", entityType: "Order", entityId: id, details: body.data } }); return Response.json(order) }
