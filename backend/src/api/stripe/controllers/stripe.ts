import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)

const generatePassword = () => {
  let pass = '';
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random()
      * str.length + 1);

    pass += str.charAt(char)
  }

  return pass;
};

export default {
  webhookListener: async (ctx, next) => {
    try {
      switch (ctx.request.body.type) {
        case "checkout.session.completed": {
          const session = ctx.request.body.data;
          let user

          const expandedSession = await stripe.checkout.sessions.retrieve(
            session.object.id, {
            expand: ['line_items']
          });

          user = await strapi.documents("plugin::users-permissions.user").findFirst({
            filters: { customer_id: session.object.customer },
            populate: { programs: true }
          });

          if (!user) {
            const customer = (await stripe.customers.retrieve(
              session.object.customer
            )) as any

            const tempPassword = generatePassword();
            const splittedName = customer.name.split(" ")
            user = await strapi.documents('plugin::users-permissions.user').create({
              data: {
                username: customer.email,
                firstname: splittedName[0],
                lastname: splittedName[1],
                email: customer.email,
                customer_id: customer.id,
                password: tempPassword,
                temp_password: tempPassword,
                confirmed: true,
                provider: "local",
              }
            })
          }



          const programId = expandedSession.line_items.data[0].price.product;

          const programContentType = strapi.contentType("api::program.program")
          const { sanitize } = strapi.contentAPI;
          const sanitizedQueryParams = await sanitize.query({
            filters: {
              product_id: programId
            },
            populate: { transactional: true }
          }, programContentType);



          const program: any = await strapi.documents(programContentType.uid).findFirst(sanitizedQueryParams);

          await strapi.documents("plugin::users-permissions.user").update({
            documentId: user.documentId,
            data: {
              programs: [...(user.programs || []), { id: program.id }] // Ajout de l'ID du programme sous forme d'objet
            }
          });

          await strapi
            .service("api::transactional.transactional")
            .addEmailToUserList({
              name: `${user.firstname} ${user.lastname}`,
              email: user.email,
              tags: program.transactional.tag,
              listId: program.transactional.list_id,
              custom_key: program.transactional.brevo_key
            })


          return program;
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
}
