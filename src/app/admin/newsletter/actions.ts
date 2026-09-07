"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { sendNewsletterCampaign } from "@/lib/email"

export type CampaignActionState = { error: string } | { success: true; sent: number } | null

export async function sendCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const admin = await requireAdmin()

  const subject = String(formData.get("subject") || "").trim()
  const body = String(formData.get("body") || "").trim()

  if (!subject || !body) {
    return { error: "Le sujet et le message sont obligatoires." }
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    select: { email: true },
  })

  let sent: number
  try {
    sent = await sendNewsletterCampaign(subject, body, subscribers.map((s) => s.email))
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Échec de l'envoi." }
  }

  await prisma.newsletterCampaign.create({
    data: { subject, body, recipients: sent, sentById: admin.id },
  })

  await prisma.adminActivity.create({
    data: {
      actorId: admin.id,
      action: `Campagne newsletter envoyée : "${subject}" (${sent} destinataire${sent > 1 ? "s" : ""})`,
      entityType: "NewsletterCampaign",
    },
  })

  revalidatePath("/admin/newsletter")
  return { success: true, sent }
}
