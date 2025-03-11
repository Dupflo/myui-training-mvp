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
    {
      method: 'POST',
      path: '/transactional/contact',
      handler: 'transactional.findContact',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      },
    },
  ],
};
