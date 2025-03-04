import { z } from "zod"

export const defaultSchema = {
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}

export const registerSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: defaultSchema.email,
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 6 caractères"),
  password: defaultSchema.password,
})


export const loginSchema = z.object({
  identifier: defaultSchema.email,
  password: defaultSchema.password,
})

export const resetPasswordLinkSchema = z.object({
  email: defaultSchema.email,
})

export const resetPasswordSchema = z.object({
  password: defaultSchema.password,
  passwordConfirmation: defaultSchema.password,
  code: z.string()
})

export type LoginInput = z.infer<typeof loginSchema>

