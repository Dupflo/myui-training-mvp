/**
 * landing-page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::landing-page.landing-page', ({ strapi }) => ({
  // Récupérer une page par son slug (public)
  async findBySlug(ctx) {
    const { slug } = ctx.params

    const entity = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { slug, publishedAt: { $notNull: true } },
      populate: {
        program: true,
        coverImage: true
      }
    })

    if (!entity) {
      return ctx.notFound('Page non trouvée')
    }

    return entity
  },

  // Récupérer une landing page par son ID (pour le builder)
  async findOne(ctx) {
    const { id } = ctx.params
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    // Récupérer toutes les versions (draft et published) de cette landing page
    const allVersions = await strapi.db.query('api::landing-page.landing-page').findMany({
      where: { documentId: id },
      populate: {
        program: {
          populate: { creator: true }
        },
        coverImage: true
      }
    })

    if (allVersions.length === 0) {
      return ctx.notFound('Page non trouvée')
    }

    // Vérifier que l'utilisateur est le créateur
    const firstVersion = allVersions[0]
    if (firstVersion.program?.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à voir cette page')
    }

    const draft = allVersions.find(v => v.publishedAt === null)
    const published = allVersions.find(v => v.publishedAt !== null)

    // Déterminer quelle version retourner :
    // - Si pas de draft, retourner published
    // - Si pas de published, retourner draft
    // - Si les deux existent, retourner le draft s'il est plus récent
    let currentVersion
    let hasNewerDraft = false

    if (!draft && published) {
      currentVersion = published
    } else if (draft && !published) {
      currentVersion = draft
    } else if (draft && published) {
      // Comparer les dates updatedAt
      const draftDate = new Date(draft.updatedAt).getTime()
      const publishedDate = new Date(published.updatedAt).getTime()

      if (draftDate > publishedDate) {
        currentVersion = draft
        hasNewerDraft = true
      } else {
        currentVersion = published
      }
    }

    return {
      ...currentVersion,
      _meta: {
        hasPublishedVersion: !!published,
        hasNewerDraft,
        publishedAt: published?.publishedAt || null,
        publishedUpdatedAt: published?.updatedAt || null
      }
    }
  },

  // Récupérer la version publiée d'une landing page (pour preview)
  async findPublishedVersion(ctx) {
    const { id } = ctx.params
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    const published = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { documentId: id, publishedAt: { $notNull: true } },
      populate: {
        program: {
          populate: { creator: true }
        },
        coverImage: true
      }
    })

    if (!published) {
      return ctx.notFound('Aucune version publiée trouvée')
    }

    if (published.program?.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à voir cette page')
    }

    return published
  },

  // Récupérer les landing pages d'un programme (pour creator)
  async findByProgram(ctx) {
    const { programId } = ctx.params
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    // Vérifier que l'utilisateur est le créateur du programme
    const program = await strapi.db.query('api::program.program').findOne({
      where: { documentId: programId },
      populate: { creator: true }
    })

    if (!program) {
      return ctx.notFound('Programme non trouvé')
    }

    if (program.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à voir ces pages')
    }

    // Récupérer toutes les entrées (drafts et published)
    const allEntities = await strapi.db.query('api::landing-page.landing-page').findMany({
      where: { program: { documentId: programId } },
      populate: { coverImage: true }
    })

    // Dédupliquer par documentId : retourner le draft en priorité, sinon le published
    const entitiesByDocumentId = new Map<string, any>()
    for (const entity of allEntities) {
      const existing = entitiesByDocumentId.get(entity.documentId)
      if (!existing) {
        // Première occurrence
        entitiesByDocumentId.set(entity.documentId, entity)
      } else {
        // Si l'existant est published et le nouveau est draft, remplacer
        if (existing.publishedAt !== null && entity.publishedAt === null) {
          entitiesByDocumentId.set(entity.documentId, entity)
        }
      }
    }

    return Array.from(entitiesByDocumentId.values())
  },

  // Créer une landing page (creator uniquement)
  async createForProgram(ctx) {
    const { programId } = ctx.params
    const { title, slug, description, content } = ctx.request.body
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    // Vérifier que l'utilisateur est le créateur du programme
    const program = await strapi.db.query('api::program.program').findOne({
      where: { documentId: programId },
      populate: { creator: true }
    })

    if (!program) {
      return ctx.notFound('Programme non trouvé')
    }

    if (program.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à créer une page pour ce programme')
    }

    const entity = await strapi.entityService.create('api::landing-page.landing-page', {
      data: {
        title,
        slug,
        description,
        content: content || { modules: [] },
        program: program.id,
        publishedAt: null // Draft par défaut
      }
    })

    return entity
  },

  // Mettre à jour le contenu d'une landing page (creator uniquement)
  async updateContent(ctx) {
    const { id } = ctx.params
    const { content, title, description, seoTitle, seoDescription } = ctx.request.body
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    // Vérifier que l'utilisateur est le créateur via program.creator
    const page = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { documentId: id },
      populate: {
        program: {
          populate: { creator: true }
        }
      }
    })

    if (!page) {
      return ctx.notFound('Page non trouvée')
    }

    if (page.program?.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à modifier cette page')
    }

    // Validation basique du JSON content
    if (content && (!content.modules || !Array.isArray(content.modules))) {
      return ctx.badRequest('Le contenu doit avoir une propriété "modules" qui est un tableau')
    }

    const entity = await strapi.db.query('api::landing-page.landing-page').update({
      where: { documentId: id },
      data: {
        ...(content && { content }),
        ...(title && { title }),
        ...(description && { description }),
        ...(seoTitle && { seoTitle }),
        ...(seoDescription && { seoDescription })
      }
    })

    return entity
  },

  // Publier/Dépublier une landing page
  async togglePublish(ctx) {
    const { id } = ctx.params
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    const page = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { documentId: id },
      populate: {
        program: {
          populate: { creator: true }
        }
      }
    })

    if (!page) {
      return ctx.notFound('Page non trouvée')
    }

    if (page.program?.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à modifier cette page')
    }

    const entity = await strapi.db.query('api::landing-page.landing-page').update({
      where: { documentId: id },
      data: {
        publishedAt: page.publishedAt ? null : new Date()
      }
    })

    return entity
  },

  // Supprimer une landing page
  async deleteById(ctx) {
    const { id } = ctx.params
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté')
    }

    const page = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { documentId: id },
      populate: {
        program: {
          populate: { creator: true }
        }
      }
    })

    if (!page) {
      return ctx.notFound('Page non trouvée')
    }

    if (page.program?.creator?.id !== user.id) {
      return ctx.forbidden('Vous n\'êtes pas autorisé à supprimer cette page')
    }

    await strapi.db.query('api::landing-page.landing-page').delete({
      where: { documentId: id }
    })

    return { success: true }
  }
}))
