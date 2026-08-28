import Stripe from "stripe"
import { prisma } from "../../../../lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    const existing = await prisma.order.findFirst({ where: { stripeId: session.id } })
    if (!existing) {
      const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
      const shipping = session.metadata?.shipping ? JSON.parse(session.metadata.shipping) : null
      const order = await prisma.order.create({ data: { userId: userId && userId !== "guest" ? userId : null, guestEmail: session.customer_details?.email ?? session.customer_email, total: (session.amount_total ?? 0) / 100, status: "PAID", paymentStatus: "PAID", stripeId: session.id, shippingAddress: shipping, items: { create: lines.data.map((line) => ({ productName: line.description ?? "Maillot", quantity: line.quantity ?? 1, size: (line.description ?? "").match(/Taille (S|M|L|XL|XXL)/)?.[1] ?? "—", price: (line.amount_total ?? 0) / 100 / (line.quantity ?? 1) })) } } })
      await prisma.adminActivity.create({ data: { action: "Nouvelle commande payée", entityType: "Order", entityId: order.id } })
      await prisma.adminNotification.create({ data: { title: "Nouvelle commande", body: `Commande #${order.id.slice(-8).toUpperCase()} · ${(order.total).toFixed(2)} €`, type: "order" } })
    }
  }

  return Response.json({ received: true })
}
