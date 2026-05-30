"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Min 6 caractères"),
})

export default function LoginPage() {
  const form = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await signIn("credentials", { ...data, callbackUrl: "/" })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Tes champs ici avec les composants Shadcn */}
    </form>
  )
}