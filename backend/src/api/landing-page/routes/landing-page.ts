/**
 * landing-page router
 */


export default {
  routes: [
    {
      method: "GET",
      path: "/landing-pages/:slug",
      handler: "landing-page.findOne",
    },
  ],
};
