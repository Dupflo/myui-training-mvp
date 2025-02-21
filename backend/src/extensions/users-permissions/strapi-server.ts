export default function (plugin) {
    const sanitizeOutput = (user) => {
        const {
            password, resetPasswordToken, confirmationToken, ...sanitizedUser
        } = user;
        return sanitizedUser;
    };

    const contentType = 'plugin::users-permissions.user'

    plugin.controllers.user.me = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }

        const users = await strapi.documents(contentType).findMany({
            filters: { id: ctx.state.user.id },
            populate: { programs: { fields: ["id", "title"] } }
        });

        ctx.body = sanitizeOutput(users[0]);
    };

    plugin.controllers.user.find = async (ctx) => {
        const users = await strapi.documents(contentType).findMany({
            filters: { id: ctx.state.user.id },
            populate: { programs: { fields: ["id", "title"] } }
        });


        ctx.body = users.map(user => sanitizeOutput(user));
    };

    return plugin;
};