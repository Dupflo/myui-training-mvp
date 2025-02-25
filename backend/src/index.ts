
import type { Core } from '@strapi/strapi';
import Stripe from 'stripe';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeCreate(event) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-08-16',
        });
        if (!event.params.data.stripe_connect_id && event.params.data.role.connect[0].id === 3) {
          console.log("yo")
          const account = await stripe.accounts.create({
            controller: {
              stripe_dashboard: {
                type: "express",
              },
              fees: {
                payer: "application"
              },
              losses: {
                payments: "application"
              },
            },
          } as any);
          event.params.data.stripe_connect_id = account.id
        }
      },
    });
  },
};
