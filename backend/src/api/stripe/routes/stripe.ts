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
  ],
};
