import Stripe from "stripe"
import { auth } from "../../../auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await auth()
  const { items } = await req.json()

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      userId: session?.user?.id ?? "",
    },
  })

  return Response.json({ url: stripeSession.url })
}