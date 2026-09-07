import { Resend } from "resend"

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "EliteFootballShop <onboarding@resend.dev>"
// Adresse où atterrissent les réponses des clients (peut être une simple
// boîte Gmail : contrairement à l'adresse d'expédition, pas besoin de
// posséder le domaine pour ça).
const REPLY_TO = process.env.RESEND_REPLY_TO || undefined

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
}

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

// Logo en texte stylé plutôt qu'en image : une image hébergée sur
// localhost est de toute façon inatteignable par les serveurs mail une
// fois l'email envoyé, et beaucoup de clients bloquent les images par
// défaut — le texte s'affiche toujours, sans dépendance externe.
const EMAIL_LOGO_HTML = `
  <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;letter-spacing:0.5px;">
    <span style="color:#60a5fa;">L'ÂME</span><span style="color:#ffffff;"> DU MAILLOT</span>
  </span>`

/** Email HTML avec styles en ligne (obligatoire pour un rendu correct dans les clients mail). */
function welcomeEmailHtml(baseUrl: string) {
  return `
  <div style="background:#edf4ff;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#172554;padding:28px 24px;text-align:center;">
        ${EMAIL_LOGO_HTML}
      </div>
      <div style="padding:32px 28px;">
        <h1 style="margin:0 0 12px;font-size:22px;color:#172554;">Bienvenue dans le club des passionnés !</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#334155;">
          Merci de vous être inscrit à la newsletter d'EliteFootballShop. Vous recevrez désormais nos nouveautés,
          nos maillots en vedette et nos offres en avant-première.
        </p>
        <div style="margin:24px 0;padding:18px;border-radius:12px;background:#eff6ff;border:1px dashed #93c5fd;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#1d4ed8;font-weight:bold;">
            Votre code de bienvenue
          </p>
          <p style="margin:0 0 6px;font-size:24px;font-weight:bold;color:#172554;letter-spacing:2px;">BIENVENUE10</p>
          <p style="margin:0;font-size:12px;color:#475569;">-10% sur votre première commande, à saisir dans votre panier.</p>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${baseUrl}" style="display:inline-block;background:#172554;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;padding:12px 28px;border-radius:10px;">
            Découvrir les maillots
          </a>
        </div>
      </div>
      <div style="padding:16px 24px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:11px;color:#94a3b8;">
          Vous recevez cet email car vous vous êtes inscrit sur elitefootballshop. Vous pouvez vous désabonner à tout moment en nous contactant.
        </p>
      </div>
    </div>
  </div>`
}

/**
 * Envoie l'email de confirmation d'inscription à la newsletter.
 * Ne fait rien (et ne fait pas échouer l'inscription) si RESEND_API_KEY
 * n'est pas configurée — voir .env.
 */
export async function sendNewsletterWelcomeEmail(email: string) {
  const resend = resendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY absente : email de bienvenue non envoyé (inscription tout de même enregistrée).")
    return
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    replyTo: REPLY_TO,
    subject: "Bienvenue chez EliteFootballShop — votre code -10% à l'intérieur",
    html: welcomeEmailHtml(getBaseUrl()),
  })

  // Le SDK Resend ne lève pas d'exception sur une erreur API : il faut
  // vérifier ce champ explicitement, sinon l'échec passe inaperçu.
  if (error) throw new Error(`Resend: ${error.message}`)
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function campaignEmailHtml(subject: string, bodyText: string, baseUrl: string, unsubscribeUrl: string) {
  const paragraphs = bodyText
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;font-size:14px;line-height:22px;color:#334155;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("")

  return `
  <div style="background:#edf4ff;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#172554;padding:28px 24px;text-align:center;">
        ${EMAIL_LOGO_HTML}
      </div>
      <div style="padding:32px 28px;">
        <h1 style="margin:0 0 16px;font-size:20px;color:#172554;">${escapeHtml(subject)}</h1>
        ${paragraphs}
        <div style="text-align:center;margin-top:24px;">
          <a href="${baseUrl}" style="display:inline-block;background:#172554;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;padding:12px 28px;border-radius:10px;">
            Voir la boutique
          </a>
        </div>
      </div>
      <div style="padding:16px 24px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:11px;color:#94a3b8;">
          Vous recevez cet email car vous êtes inscrit à la newsletter EliteFootballShop.
          <a href="${unsubscribeUrl}" style="color:#64748b;">Se désabonner</a>
        </p>
      </div>
    </div>
  </div>`
}

const BATCH_SIZE = 100

/**
 * Envoie une campagne promo à une liste d'adresses, par lots de 100
 * (limite de l'API "batch" de Resend). Chaque personne reçoit un email
 * individuel — les adresses des autres abonnés ne sont jamais visibles.
 * Renvoie le nombre d'emails effectivement envoyés.
 */
export async function sendNewsletterCampaign(subject: string, bodyText: string, recipients: string[]): Promise<number> {
  const resend = resendClient()
  if (!resend) throw new Error("RESEND_API_KEY absente : impossible d'envoyer la campagne.")
  if (!recipients.length) return 0

  const baseUrl = getBaseUrl()
  let sent = 0

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE)
    // "permissive" : une adresse invalide/refusée (ex: pas encore autorisée
    // en mode test Resend) n'annule pas l'envoi aux autres destinataires du
    // même lot — sans ça, un seul mauvais email bloque toute la campagne.
    const { data, error } = await resend.batch.send(
      chunk.map((email) => ({
        from: FROM_ADDRESS,
        to: email,
        replyTo: REPLY_TO,
        subject,
        html: campaignEmailHtml(subject, bodyText, baseUrl, `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`),
      })),
      { batchValidation: "permissive" }
    )

    // Le SDK Resend ne lève pas d'exception sur une erreur API (ex: domaine
    // d'expédition non vérifié) : sans cette vérification, l'envoi échoue
    // en silence et la campagne se retrouve marquée comme "envoyée" à tort.
    if (error) {
      throw new Error(`Resend: ${error.message}${sent ? ` (${sent} email(s) déjà envoyés avant l'erreur)` : ""}`)
    }

    const failed = "errors" in data ? data.errors : []
    if (failed?.length) {
      console.warn("Certains destinataires de la campagne ont échoué :", failed.map((f) => `${chunk[f.index]}: ${f.message}`))
    }

    sent += data?.data?.length ?? 0
  }

  return sent
}
