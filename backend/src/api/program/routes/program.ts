export default {
  routes: [
    {
      method: "GET",
      path: "/programs",
      handler: "program.find",
    },
    {
      method: "GET",
      path: "/programs/:id",
      handler: "program.findOne",
    },
    {
      method: "POST",
      path: "/programs/:id/checkout",
      handler: "program.checkout",
    },
  ],
};
