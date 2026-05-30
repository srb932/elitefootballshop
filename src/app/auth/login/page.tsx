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
// On dit à useForm d'utiliser le type généré par ton schéma z.infer<typeof schema>
const form = useForm<z.infer<typeof schema>>({ 
  resolver: zodResolver(schema) 
})

// On précise à TypeScript que 'data' correspond exactement à la structure de ton 'schema'
const onSubmit = async (data: z.infer<typeof schema>) => {
    await signIn("credentials", { ...data, callbackUrl: "/" })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Tes champs ici avec les composants Shadcn */}
    </form>
  )
}