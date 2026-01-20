/**
 * landing-page router
 */

export default {
  routes: [
    // Routes CRUD par défaut
    {
      method: 'GET',
      path: '/landing-pages',
      handler: 'landing-page.find',
    },
    {
      method: 'GET',
      path: '/landing-pages/:id',
      handler: 'landing-page.findOne',
    },
    {
      method: 'POST',
      path: '/landing-pages',
      handler: 'landing-page.create',
    },
    {
      method: 'PUT',
      path: '/landing-pages/:id',
      handler: 'landing-page.update',
    },
    {
      method: 'DELETE',
      path: '/landing-pages/:id',
      handler: 'landing-page.delete',
    },
    {
      method: 'GET',
      path: '/landing-pages/slug/:slug',
      handler: 'landing-page.findBySlug',
      config: {
        auth: false,
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/landing-pages/:id/published',
      handler: 'landing-page.findPublishedVersion',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/landing-pages/program/:programId',
      handler: 'landing-page.findByProgram',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/landing-pages/program/:programId',
      handler: 'landing-page.createForProgram',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/landing-pages/:id/content',
      handler: 'landing-page.updateContent',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/landing-pages/:id/publish',
      handler: 'landing-page.togglePublish',
      config: {
        policies: []
      }
    },
  ]
}
