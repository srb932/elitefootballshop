import { prisma } from "@/lib/prisma"
import { sendNewsletterWelcomeEmail } from "@/lib/email"
import { z } from "zod"

const payload = z.object({ email: z.string().trim().email().max(255) })

export async function POST(request: Request) {
  const result = payload.safeParse(await request.json())
  if (!result.success) return Response.json({ error: "Adresse e-mail invalide." }, { status: 400 })

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: result.data.email } })
  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: result.data.email },
    update: { unsubscribedAt: null },
    create: { email: result.data.email },
  })

  if (!existing || existing.unsubscribedAt) {
    // La newsletter reste inscrite même si l'envoi de l'email échoue
    // (clé Resend absente, service indisponible...).
    await sendNewsletterWelcomeEmail(result.data.email).catch((err) =>
      console.error("Erreur envoi email de bienvenue newsletter:", err)
    )
  }

  await prisma.adminNotification.create({
    data: { title: "Nouvelle inscription newsletter", body: result.data.email, type: "newsletter" },
  })

  return Response.json({ id: subscriber.id })
}
