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

    if (userId && userId !== "guest") {
      await prisma.order.create({
        data: {
          userId,
          total: (session.amount_total ?? 0) / 100,
          status: "PAID",
          stripeId: session.id,
        },
      })
    }
  }

  return Response.json({ received: true })
}