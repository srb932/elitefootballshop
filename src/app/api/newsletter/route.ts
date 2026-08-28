import { prisma } from "@/lib/prisma"
import { z } from "zod"
const payload = z.object({ email: z.string().trim().email().max(255) })
export async function POST(request: Request) { const result = payload.safeParse(await request.json()); if (!result.success) return Response.json({ error: "Adresse e-mail invalide." }, { status: 400 }); const subscriber = await prisma.newsletterSubscriber.upsert({ where: { email: result.data.email }, update: {}, create: { email: result.data.email } }); await prisma.adminNotification.create({ data: { title: "Nouvelle inscription newsletter", body: result.data.email, type: "newsletter" } }); return Response.json({ id: subscriber.id }) }
