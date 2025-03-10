import console from "console";
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
            const splittedName = customer.name?.split(" ")
            user = await strapi.documents('plugin::users-permissions.user').create({
              data: {
                username: customer.email,
                firstname: splittedName?.[0],
                lastname: splittedName?.[1],
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
  },
  syncStripeCustomers: async (ctx) => {
    try {
      let hasMore = true;
      let lastPaymentId = null;
      const customerIds = new Set();
      const guestEmails = new Set();

      // Retrieve all payments by paginating
      while (hasMore) {
        const paymentParams: any = { limit: 100, expand: ['data.customer'] };
        if (lastPaymentId) paymentParams.starting_after = lastPaymentId;

        const payments: any = await stripe.paymentIntents.list(paymentParams);
        for (const payment of payments.data) {
          if (payment.customer) {
            customerIds.add(payment.customer.id);
          } else {
            const charges = await stripe.charges.list({ payment_intent: payment.id });
            charges.data.forEach((charge) => {
              if (charge.billing_details.email) {
                guestEmails.add(charge.billing_details.email.toLowerCase());
              }
            });
          }
        }
        hasMore = payments.has_more;
        if (hasMore) lastPaymentId = payments.data[payments.data.length - 1].id;
      }

      // Process Stripe customers
      for (const customerId of customerIds) {
        await createOrUpdateUserFromStripe(customerId);
      }

      // Process guest emails
      for (const email of guestEmails) {
        await createOrUpdateUserFromEmail(email);
      }

      ctx.send({ message: 'Synchronisation des clients Stripe terminée avec succès' });
    } catch (error) {
      console.error(error);
      ctx.throw(500, 'Erreur lors de la synchronisation des clients Stripe', { error });
    }
  },
}


async function createOrUpdateUserFromStripe(customerId) {
  const customer: any = await stripe.customers.retrieve(customerId);
  const email = customer.email?.toLowerCase();
  if (!email) return;

  const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });
  if (existingUser) return;

  const programs = await getUserPrograms(customer.id);
  if (programs.length === 0) return;

  const tempPassword = generatePassword();

  await strapi.documents('plugin::users-permissions.user').create({
    data: {
      username: email,
      firstname: customer.name?.split(' ')[0] || 'Utilisateur',
      lastname: customer.name?.split(' ')[1] || 'Anonyme',
      email,
      customer_id: customer.id,
      password: tempPassword,
      temp_password: tempPassword,
      confirmed: true,
      provider: 'local',
      programs
    },
  });
}

async function createOrUpdateUserFromEmail(email) {
  const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });
  const program = await getProgramById("yec6f7nxucoqpx63yopl5ezf");

  if (existingUser) {
    await strapi.documents("plugin::users-permissions.user").update({
      documentId: existingUser.documentId,
      data: {
        programs: [...(existingUser.programs || []), { id: program.id }] // Ajout de l'ID du programme sous forme d'objet
      }
    });
    return
  }

  const tempPassword = generatePassword();

  await strapi.documents('plugin::users-permissions.user').create({
    data: {
      username: email,
      email,
      password: tempPassword,
      temp_password: tempPassword,
      confirmed: true,
      provider: 'local',
      programs: [program]
    },
  });
}

async function getUserPrograms(customerId) {
  let hasMorePayments = true;
  let lastPaymentId = null;
  let programs = [];

  while (hasMorePayments) {
    const paymentParams: any = { customer: customerId, limit: 100 };
    if (lastPaymentId) paymentParams.starting_after = lastPaymentId;
    const payments = await stripe.paymentIntents.list(paymentParams);

    for (const payment of payments.data) {
      const programId = payment.amount_received / 100 < 50
        ? 'yec6f7nxucoqpx63yopl5ezf'
        : 'r440p52r8660d5wdc544rov9';
      const program = await getProgramById(programId);
      if (program) programs.push({ id: program.id });
    }

    hasMorePayments = payments.has_more;
    if (hasMorePayments) lastPaymentId = payments.data[payments.data.length - 1].id;
  }
  return programs;
}

async function getProgramById(programId) {
  const programContentType = strapi.contentType('api::program.program');
  const { sanitize } = strapi.contentAPI;
  const sanitizedQueryParams = await sanitize.query({
    filters: { documentId: programId },
    populate: { transactional: true }
  }, programContentType);

  return await strapi.documents(programContentType.uid).findFirst(sanitizedQueryParams);
}
