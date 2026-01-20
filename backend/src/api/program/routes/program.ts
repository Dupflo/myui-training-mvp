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
      path: "/programs",
      handler: "program.create",
    },
    {
      method: "PUT",
      path: "/programs/:id",
      handler: "program.update",
    },
    {
      method: "DELETE",
      path: "/programs/:id",
      handler: "program.delete",
    },
    {
      method: "POST",
      path: "/programs/:id/checkout",
      handler: "program.checkout",
    },
  ],
};
