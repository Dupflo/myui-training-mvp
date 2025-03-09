'use server'

import { loginSchema, registerSchema, resetPasswordLinkSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { fetchCMS } from "@/utils/fetchers";
import console from "console";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.API_URL || "http://localhost:1337"

function generateRandomPassword(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function register(prevState: unknown, formData: FormData) {
  const cookiesList = await cookies()

  const tempPassword = generateRandomPassword(7)

  const rawFormData = {
    email: formData.get("email"),
    username: formData.get("email"),
    password: tempPassword,
    temp_password: tempPassword
  }

  const validatedFields = registerSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawFormData),
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
    console.error(error)
    return { error: "Une erreur est survenue lors d'inscription" }
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
    const response = await fetch(`${STRAPI_URL}/auth/local`, {
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
    console.log(error)
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
    const response = await fetch(`${STRAPI_URL}/users/me`, {
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

export async function changeUserPassword(user, formData) {
  const cookiesList = await cookies()
  const token = cookiesList.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${STRAPI_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "currentPassword": user.temp_password,
        "password": formData.get("password"),
        "passwordConfirmation": formData.get("password"),
      })
    })

    const changePass = await response.json()

    console.log(changePass)

    if (!response.ok) {
      return null
    }

    const res = await fetch(`${STRAPI_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "tempPassword": '',
        "createdPassword": true,
      })
    })

    const updatedUser = await res.json()
    return updatedUser
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

export async function checkIfUserExist(formData: FormData) {
  const email = formData.get("email")
  try {
    const response = await fetch(`${STRAPI_URL}/users?email=${email}`, {
      headers: { "Content-Type": "application/json" }
    })
    const data = await response.json()
    return { email: data.email }
  } catch (error) {
    return error
  }
}

export async function loggedUserFromSession(session_id: string) {
  try {
    const response = await fetch(`${STRAPI_URL}/users?session_id=${session_id}`, {
      headers: { "Content-Type": "application/json" }
    })
    const user = await response.json()

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("password", user.temp_password);

    const loginResponse = await login(null, formData);
    console.log(loginResponse)
    return loginResponse;
  } catch (error) {
    return error
  }
}

/*** MUST BE REMOVED FOR SECURITY */

export async function loggedUserFromEmail(email: string) {
  try {
    const response = await fetch(`${STRAPI_URL}/users?email=${email}`, {
      headers: { "Content-Type": "application/json" }
    })
    const user = await response.json()

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("password", user.temp_password);

    const loginResponse = await login(null, formData);
    return loginResponse;
  } catch (error) {
    return error
  }
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

    const response = await fetch(`${STRAPI_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

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

    const response = await fetch(`${STRAPI_URL}/auth/reset-password`, {

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


export async function generateCheckoutPage({ programId, email, customerId }: { programId: string, email?: string, customerId?: string }) {
  try {
    const checkoutPage = await fetchCMS({
      path: `programs/${programId}/checkout`,
      method: "POST",
      body: { customerId, email },
    })
    return checkoutPage
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function addUserToWaitList(formData: FormData) {
  try {
    const rawFormData = { name: formData.get('name'), email: formData.get('email'), organization: formData.get('organization') }

    const response = await fetchCMS({
      path: `transactional/waitlist`,
      method: "POST",
      body: rawFormData,
    })
    return response
  } catch (error) {
    console.log(error)
    return error
  }
}

