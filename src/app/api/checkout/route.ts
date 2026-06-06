import Stripe from "stripe"
import { auth } from "@/auth"
import type { CartItem } from "@/store/cartStore"
import type { ShippingInfo } from "@/types/product"

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
}

function absoluteImage(url: string, baseUrl: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith("http")) return url
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Stripe n'est pas configuré. Ajoutez STRIPE_SECRET_KEY dans .env" },
        { status: 500 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await auth()
    const body = await req.json()
    const items: CartItem[] = body.items ?? []
    const shipping: ShippingInfo = body.shipping ?? {}
    const discount: number = Number(body.discount) || 0

    if (!items.length) {
      return Response.json({ error: "Panier vide." }, { status: 400 })
    }

    const baseUrl = getBaseUrl()
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const discountRatio = subtotal > 0 ? Math.min(discount / subtotal, 1) : 0

    const line_items = items.map((item) => {
      const unitPrice = Math.max(0.5, item.price * (1 - discountRatio))
      const image = absoluteImage(item.image, baseUrl)

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.name} — Taille ${item.size}`,
            description: item.flocage?.nom
              ? `Flocage: ${item.flocage.nom}${item.flocage.numero ? ` n°${item.flocage.numero}` : ""}`
              : undefined,
            ...(image ? { images: [image] } : {}),
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: item.quantity,
      }
    })

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: shipping.email || undefined,
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?cart=1`,
      metadata: {
        userId: session?.user?.id ?? "guest",
        shipping: JSON.stringify(shipping),
        discount: String(discount),
      },
    })

    return Response.json({ url: stripeSession.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur Stripe." },
      { status: 500 }
    )
  }
}
