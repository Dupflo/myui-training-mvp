import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email("Adresse e-mail invalide"),
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 6 caractères"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})


export const loginSchema = z.object({
    identifier: z.string().email("Adresse e-mail invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type LoginInput = z.infer<typeof loginSchema>

