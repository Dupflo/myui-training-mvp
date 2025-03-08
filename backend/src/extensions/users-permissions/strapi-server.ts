import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)

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
      let email = ctx.query.email

      if (!email) {
        const session = await stripe.checkout.sessions.retrieve(ctx.query.session_id);
        const customer: any = await stripe.customers.retrieve(session.customer as string);
        email = customer.email
      }

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