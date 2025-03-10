/**
 * landing-page router
 */


export default {
  routes: [
    {
      method: "GET",
      path: "/landing-pages",
      handler: "landing-page.find",
    },
    {
      method: "GET",
      path: "/landing-pages/:slug",
      handler: "landing-page.findOne",
    },
  ],
};
