
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
        /** SETUP CUSTOMER ID **/
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-08-16',
        });

        if (!event.params.data.customer_id) {
          const customer = await stripe.customers.create({
            name: `${event.params.data.firstname} ${event.params.data.lastname}`,
            email: event.params.data.email,
          })
          event.params.data.customer_id = customer.id
        }
        if (!event.params.data.role?.connect?.[0].id) { event.params.data.role = 4 }

        /** SETUP CONNECT ID **/
        if (!event.params.data.connect_id && event.params.data.role?.connect?.[0].id === 3) {
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
          event.params.data.connect_id = account.id
        }
      }
    });
  },
};
