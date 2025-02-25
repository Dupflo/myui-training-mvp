
import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});

const program_model = {
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
        const sanitizedQueryParams = await sanitize.query({ populate: { program_model } }, contentType, { auth: ctx.state.auth });

        const documents = await strapi.documents(contentType.uid).findMany(sanitizedQueryParams);

        return await sanitize.output(documents, contentType, { auth: ctx.state.auth });
    },
    async findOne(ctx) {
        const { sanitize } = strapi.contentAPI;
        const contentType = strapi.contentType("api::program.program")

        // sanitizeQuery to remove any query params that are invalid or the user does not have access to
        // It is strongly recommended to use sanitizeQuery even if validateQuery is used
        const sanitizedQueryParams = await sanitize.query({
            populate: { program_model },
            filters: {
                documentId: ctx.params.id
            }
        }, contentType, { auth: ctx.state.auth });

        const documents = await strapi.documents(contentType.uid).findFirst(sanitizedQueryParams);

        return await sanitize.output(documents, contentType, { auth: ctx.state.auth });
    },
    async createCheckout(ctx) {
        const session = await stripe.checkout.sessions.create({
            success_url: 'https://example.com/success',
            line_items: [
                {
                    price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
                    quantity: 2,
                },
            ],
            mode: 'payment',
        });
        ctx.body = session
    }
}));