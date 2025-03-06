export default {
  routes: [
    {
      method: 'GET',
      path: '/notion',
      handler: 'notion.exampleAction',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      },
    },
  ],
};
