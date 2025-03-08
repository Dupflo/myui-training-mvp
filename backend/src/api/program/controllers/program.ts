import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const program_model = {
  on: {
    "program-models.modules": {
      populate: { modules: { populate: { videos: true }, } }
    },
    "program-models.ressources": {
      populate: {
        resources: { populate: { media: true } },

      }
    }
  }
}

export default factories.createCoreController('api::program.program', ({ strapi }) => ({
  async find(ctx) {
    const { sanitize } = strapi.contentAPI;
    const contentType = strapi.contentType("api::program.program")

    // sanitizeQuery to remove any query params that are invalid or the user does not have access to
    // It is strongly recommended to use sanitizeQuery even if validateQuery is used
    const sanitizedQueryParams = await sanitize.query({ populate: { image: true, program_model } }, contentType, { auth: ctx.state.auth });

    const documents = await strapi.documents(contentType.uid).findMany(sanitizedQueryParams);

    return await sanitize.output(documents, contentType, { auth: ctx.state.auth });
  },
  async findOne(ctx) {
    const { sanitize } = strapi.contentAPI;
    const contentType = strapi.contentType("api::program.program")

    // sanitizeQuery to remove any query params that are invalid or the user does not have access to
    // It is strongly recommended to use sanitizeQuery even if validateQuery is used
    const sanitizedQueryParams = await sanitize.query({
      populate: { image: true, program_model },
      filters: {
        documentId: ctx.params.id
      }
    }, contentType, { auth: ctx.state.auth });

    const documents = await strapi.documents(contentType.uid).findFirst(sanitizedQueryParams);

    return await sanitize.output(documents, contentType, { auth: ctx.state.auth });
  },
  async checkout(ctx) {
    const { sanitize } = strapi.contentAPI;
    const { customerId, email } = ctx.request.body
    const contentType = strapi.contentType("api::program.program")
    const sanitizedQueryParams = await sanitize.query({
      populate: { program_model, connected_accounts: { populate: { account: true } } },
      filters: {
        documentId: ctx.params.id
      }
    }, contentType, { auth: ctx.state.auth });

    const program: any = await strapi.documents(contentType.uid).findFirst(sanitizedQueryParams);

    const prices = await stripe.prices.list({ product: program.product_id, });
    const defaultPrice = prices.data.find(price => price.id === prices.data[0].id)


    const sessionData: any = {
      success_url: `${process.env.FRONTEND_URL}/checkout/${ctx.params.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/programs`,
      allow_promotion_codes: true,
      payment_intent_data: {
        setup_future_usage: true
      },
      customer_email: email,
      line_items: [
        {
          price: defaultPrice.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
    };

    if (customerId) {
      sessionData.customer = customerId
    }
    else if (email) {
      sessionData.customer_email = email
      sessionData.customer_creation = "always"
    }

    if (ctx.query.coupon) {
      sessionData.allow_promotion_codes = undefined
      sessionData.discounts = []
      sessionData.discounts.push({ coupon: ctx.query.coupon })
    }
    if (ctx.query.promotion_code) {
      sessionData.allow_promotion_codes = undefined
      sessionData.discounts = []
      sessionData.discouns.push({ promotion_code: ctx.query.promotion_code })
    }
    // Ajouter payment_intent_data uniquement si program.connected_accounts > 0
    if (program.connected_accounts.length > 0) {
      sessionData.payment_intent_data = {
        application_fee_amount: Math.floor(defaultPrice.unit_amount * (1 - (program.connected_accounts[0].fee_amount + (ctx.query.coupon ? 5 : 0)) / 100)),
        transfer_data: {
          destination: program.connected_accounts[0].account.connect_id
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    ctx.body = session;
  }
}));