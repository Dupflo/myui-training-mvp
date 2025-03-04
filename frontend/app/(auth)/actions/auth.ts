'use server'

import { loginSchema, registerSchema, resetPasswordLinkSchema, resetPasswordSchema } from "@/lib/validations/auth"
import { cookies } from "next/headers"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"

export async function register(prevState: unknown, formData: FormData) {
  const cookiesList = await cookies()

  const validatedFields = registerSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    username: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
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
      const error = await response.json()
      console.log(error)
      return { error: "Un compte existe déjà avec ces identifiants" }
    }
  } catch (error) {
    return { error: "Une erreur est survenue lors de la connexion" }
  }
}

export async function login(prevState: unknown, formData: FormData) {
  const cookiesList = await cookies()

  const validatedFields = loginSchema.safeParse({
    identifier: formData.get("email"),
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
      return null
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function signOut() {
  const cookiesList = await cookies()

  cookiesList.delete("token")

  return { success: true }
}



export async function sendResetPasswordLink(_: unknown, formData: FormData) {
  try {

    const validatedFields = resetPasswordLinkSchema.safeParse({
      email: formData.get("email"),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email } = validatedFields.data

    const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to send reset link")
    }

    if (response.ok) {
      return { success: true }
    } else {

      return { error: "Erreur lors de l'authentification" }
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function resetPasswordAndSignIn(_: unknown, formData: FormData) {
  try {


    const validatedFields = resetPasswordSchema.safeParse({
      "password": formData.get("password"),
      "passwordConfirmation": formData.get("password"),
      "code": formData.get("code"),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {

      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data)
    })

    if (response.ok) {
      const cookiesList = await cookies()
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
      const error = await response.json()
      return error
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

