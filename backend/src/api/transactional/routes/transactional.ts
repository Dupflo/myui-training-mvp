export default {
  routes: [
    {
      method: 'POST',
      path: '/transactional/waitlist',
      handler: 'transactional.addToWaitlist',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
