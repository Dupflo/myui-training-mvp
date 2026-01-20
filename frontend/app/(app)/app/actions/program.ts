'use server'

import { Program } from '@/lib/types/page-builder'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

const STRAPI_URL = process.env.API_URL || 'http://localhost:1337'

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookiesList = await cookies()
  const token = cookiesList.get('token')?.value

  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// ============================================
// Lecture
// ============================================

export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/programs?populate=*`, {
      headers: await getAuthHeaders(),
      next: { tags: ['programs'] }
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error)
    return []
  }
}

export async function getProgramById(id: string): Promise<Program | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/programs/${id}?populate=*`, {
      headers: await getAuthHeaders(),
      next: { tags: [`program:${id}`] }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Erreur lors de la récupération du programme:', error)
    return null
  }
}

export async function getMyPrograms(): Promise<Program[]> {
  try {
    const cookiesList = await cookies()
    const token = cookiesList.get('token')?.value

    if (!token) {
      return []
    }

    // D'abord récupérer l'utilisateur connecté
    const userResponse = await fetch(`${STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!userResponse.ok) {
      return []
    }

    const user = await userResponse.json()

    // Récupérer les programmes créés par cet utilisateur
    const response = await fetch(
      `${STRAPI_URL}/programs?filters[creator][id][$eq]=${user.id}&populate=*`,
      {
        headers: await getAuthHeaders(),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error)
    return []
  }
}

// ============================================
// Création
// ============================================

export async function createProgram(data: {
  title: string
  description?: string
  price?: number
}): Promise<{ success: boolean; data?: Program; error?: string }> {
  try {
    const cookiesList = await cookies()
    const token = cookiesList.get('token')?.value

    if (!token) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    // Récupérer l'utilisateur connecté
    const userResponse = await fetch(`${STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!userResponse.ok) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    const user = await userResponse.json()

    // Créer le programme avec le créateur
    const response = await fetch(`${STRAPI_URL}/programs`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        data: {
          ...data,
          creator: user.id,
          program_model: [] // Requis selon le schéma
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error?.message || 'Erreur lors de la création' }
    }

    const program = await response.json()
    
    revalidateTag('programs')
    revalidatePath('/app')

    return { success: true, data: program.data || program }
  } catch (error) {
    console.error('Erreur lors de la création du programme:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// ============================================
// Mise à jour
// ============================================

export async function updateProgram(
  id: string,
  data: {
    title?: string
    description?: string
    price?: number
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/programs/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ data })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error?.message || 'Erreur lors de la mise à jour' }
    }

    revalidateTag(`program:${id}`)
    revalidateTag('programs')
    revalidatePath('/app')

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// ============================================
// Suppression
// ============================================

export async function deleteProgram(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/programs/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error?.message || 'Erreur lors de la suppression' }
    }

    revalidateTag('programs')
    revalidatePath('/app')

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
