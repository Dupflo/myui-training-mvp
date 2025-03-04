import { Core } from '@strapi/strapi';
import Stripe from 'stripe';

const stripeConnect = ({ strapi }: { strapi: Core.Strapi }) => ({
  async createConnectOnboarding(ctx) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });

    const account = ctx.request.body.account;

    try {
      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: `${process.env.APP_URL}/admin/content-manager/collection-types/plugin::users-permissions.user/${account.documentId}`,
        return_url: `${process.env.APP_URL}/admin/content-manager/collection-types/plugin::users-permissions.user/${account.documentId}`,
        type: "account_onboarding",
      });

      ctx.send({ url: accountLink.url, });
    } catch (error) {
      console.error('An error occurred when calling the Stripe API to create an account:', error);
      ctx.throw(500, error);
    }
  },
  async createConnectAccountLink(ctx) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });

    const account = ctx.request.body.account;

    try {
      const loginLink = await stripe.accounts.createLoginLink(account);

      ctx.send({ url: loginLink.url, });
    } catch (error) {
      console.error('An error occurred when calling the Stripe API to create an account:', error);
      ctx.throw(500, error);
    }
  }
});

export default stripeConnect;