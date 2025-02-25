import { Core } from '@strapi/strapi';
import Stripe from 'stripe';

const stripeConnect = ({ strapi }: { strapi: Core.Strapi }) => ({
    async createConnectAccountLink(ctx) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-08-16',
        });

        const account = "acct_1Qw2pjCEpBOEtHBl"

        try {
            const accountLink = await stripe.accountLinks.create({
                account: account,
                refresh_url: `http://localhost:1337/admin/content-manager/collection-types/plugin::users-permissions.user/r24tdf1m98lz8hkjqk06d80u`,
                return_url: `http://localhost:1337/admin/content-manager/collection-types/plugin::users-permissions.user/r24tdf1m98lz8hkjqk06d80u`,
                type: "account_onboarding",
            });

            ctx.send({ url: accountLink.url, });
        } catch (error) {
            console.error('An error occurred when calling the Stripe API to create an account:', error);
            ctx.throw(500, error);
        }
    },
});

export default stripeConnect;