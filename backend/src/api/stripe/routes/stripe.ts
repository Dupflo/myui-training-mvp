export default {
  routes: [
    {
      method: 'POST',
      path: '/stripe',
      handler: 'stripe.webhookListener',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/stripe/sync',
      handler: 'stripe.syncStripeCustomers',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
