/**
 * A set of functions called "actions" for `transactional`
 */

export default {
  addToWaitlist: async (ctx, next) => {
    const response = await strapi
      .service("api::transactional.transactional")
      .addEmailToUserList({
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        organization: ctx.request.body.organization,
        listId: 4
      })
    ctx.body = response
  },
}
