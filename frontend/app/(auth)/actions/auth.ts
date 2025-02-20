'use server'

import { cookies } from "next/headers"
import { registerSchema, loginSchema } from "@/lib/validations/auth"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"

export async function register(prevState: unknown, formData: FormData) {
    const cookiesList = await cookies()

    const validatedFields = registerSchema.safeParse({
        email: formData.get("email"),
        username: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, username, password } = validatedFields.data

    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        })

        if (response.ok) {
            const data = await response.json()
            const { jwt } = data

            // Stocker le JWT dans un cookie HttpOnly
            cookiesList.set("token", jwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 semaine
                path: "/",
            })

            return { success: true }
        } else {
            return { error: "Un compte existe déjà avec ces identifiants" }
        }
    } catch (error) {
        return { error: "Une erreur est survenue lors de la connexion" }
    }
}

export async function login(prevState: unknown, formData: FormData) {
    const cookiesList = await cookies()

    const validatedFields = loginSchema.safeParse({
        identifier: formData.get("identifier"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { identifier, password } = validatedFields.data

    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
        })

        if (response.ok) {
            const data = await response.json()
            const { jwt } = data

            // Stocker le JWT dans un cookie HttpOnly
            cookiesList.set("token", jwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 semaine
                path: "/",
            })

            return { success: true }
        } else {
            return { error: "Identifiants invalides" }
        }
    } catch (error) {
        return { error: "Une erreur est survenue lors de la connexion" }
    }
}

export async function getCurrentUser() {
    const cookiesList = await cookies()
    const token = cookiesList.get("token")?.value

    if (!token) {
        return null
    }

    try {
        const response = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch user")
        }

        const user = await response.json()
        return user
    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    }
}
