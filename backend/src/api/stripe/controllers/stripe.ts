import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)

export default {
  webhookListener: async (ctx, next) => {


    console.log('hello')
    try {
      switch (ctx.request.body.type) {
        case "checkout.session.completed": {
          const session = ctx.request.body.data;

          const expandedSession = await stripe.checkout.sessions.retrieve(
            session.object.id, {
            expand: ['line_items']
          });

          console.log(session.object.customer)

          const user = await strapi.documents("plugin::users-permissions.user").findFirst({
            filters: { customer_id: session.object.customer },
            populate: { programs: true }
          });

          console.log(user)

          const programId = expandedSession.line_items.data[0].price.product;

          const programContentType = strapi.contentType("api::program.program")
          const { sanitize } = strapi.contentAPI;
          const sanitizedQueryParams = await sanitize.query({
            filters: {
              product_id: programId
            }
          }, programContentType);


          const program = await strapi.documents(programContentType.uid).findFirst(sanitizedQueryParams);
          console.log(program)

          await strapi.documents("plugin::users-permissions.user").update({
            documentId: user.documentId,
            data: {
              programs: [...(user.programs || []), { id: program.id }] // Ajout de l'ID du programme sous forme d'objet
            }
          });

          return program;
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
}
