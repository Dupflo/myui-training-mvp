export default function (plugin) {
  const sanitizeOutput = (user) => {
    const {
      password, resetPasswordToken, confirmationToken, ...sanitizedUser
    } = user;
    return sanitizedUser;
  };

  const contentType = 'plugin::users-permissions.user'

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    const users = await strapi.documents(contentType).findMany({
      filters: { id: ctx.state.user.id },
      populate: { programs: { fields: ["id", "title"] } }
    });

    ctx.body = sanitizeOutput(users[0]);
  };

  plugin.controllers.user.find = async (ctx) => {
    try {
      const { email } = ctx.query

      const existingUser = await strapi.documents(contentType).findFirst({
        filters: { email }
      });

      if (existingUser) { ctx.body = existingUser }
      else {
        ctx.response.status = 404
        ctx.body = { message: 'no user with this email' }
      }
    } catch (error) {
      ctx.body = error
    }
  };

  return plugin;
};