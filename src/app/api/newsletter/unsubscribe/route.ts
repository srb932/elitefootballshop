import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase()

  if (email) {
    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { unsubscribedAt: new Date() },
    })
  }

  return new Response(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Désabonnement</title></head>
    <body style="font-family:Arial,Helvetica,sans-serif;background:#edf4ff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
      <div style="max-width:420px;background:#fff;border-radius:16px;padding:32px;text-align:center;border:1px solid #e2e8f0;">
        <h1 style="font-size:18px;color:#172554;margin:0 0 8px;">Vous êtes désabonné</h1>
        <p style="font-size:14px;color:#334155;margin:0;">Vous ne recevrez plus nos emails promotionnels. Vous pouvez vous réinscrire à tout moment depuis le site.</p>
      </div>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}
