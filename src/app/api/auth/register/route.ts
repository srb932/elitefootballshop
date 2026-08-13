import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email et mot de passe (6 caractères min.) requis." },
        { status: 400 }
      )
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nom d'utilisateur requis (2 caractères min.)." },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name.trim(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
