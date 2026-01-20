'use server'

import { LandingPage, PageContent } from '@/lib/types/page-builder'
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

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/slug/${slug}`, {
      headers: await getAuthHeaders(),
      next: { tags: [`landing-page:${slug}`] }
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération de la page:', error)
    return null
  }
}

export async function getLandingPageById(id: string): Promise<LandingPage | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${id}?populate=*`, {
      headers: await getAuthHeaders(),
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Erreur lors de la récupération de la page:', error)
    return null
  }
}

export async function getLandingPagesByProgram(programId: string): Promise<LandingPage[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/program/${programId}`, {
      headers: await getAuthHeaders(),
      cache: 'no-store'
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des pages:', error)
    return []
  }
}

export async function getLandingPagePublishedVersion(id: string): Promise<LandingPage | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${id}/published`, {
      headers: await getAuthHeaders(),
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération de la version publiée:', error)
    return null
  }
}

// ============================================
// Création
// ============================================

export async function createLandingPage(
  programId: string,
  data: {
    title: string
    slug: string
    description?: string
  }
): Promise<{ success: boolean; data?: LandingPage; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/program/${programId}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        content: { modules: [], version: 1 }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erreur lors de la création' }
    }

    const landingPage = await response.json()

    revalidateTag(`program:${programId}`)
    revalidatePath(`/app/program/${programId}`)

    return { success: true, data: landingPage }
  } catch (error) {
    console.error('Erreur lors de la création de la page:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// ============================================
// Mise à jour
// ============================================

export async function updateLandingPageContent(
  pageId: string,
  content: PageContent
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${pageId}/content`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erreur lors de la mise à jour' }
    }

    // Pas de revalidation ici car c'est un draft
    // La revalidation se fait lors de la publication

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export async function updateLandingPageInfo(
  pageId: string,
  data: {
    title?: string
    description?: string
    seoTitle?: string
    seoDescription?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${pageId}/content`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erreur lors de la mise à jour' }
    }

    const page = await response.json()

    revalidateTag(`landing-page:${page.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// ============================================
// Publication
// ============================================

export async function toggleLandingPagePublish(
  pageId: string
): Promise<{ success: boolean; published: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${pageId}/publish`, {
      method: 'PUT',
      headers: await getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, published: false, error: error.message || 'Erreur lors de la publication' }
    }

    const page = await response.json()

    revalidateTag(`landing-page:${page.slug}`)
    revalidatePath(`/${page.slug}`)

    return { success: true, published: !!page.publishedAt }
  } catch (error) {
    console.error('Erreur lors de la publication:', error)
    return { success: false, published: false, error: 'Une erreur est survenue' }
  }
}

// ============================================
// Suppression
// ============================================

export async function deleteLandingPage(
  pageId: string,
  programId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/landing-pages/${pageId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erreur lors de la suppression' }
    }

    revalidateTag(`program:${programId}`)
    revalidatePath(`/app/program/${programId}`)

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
