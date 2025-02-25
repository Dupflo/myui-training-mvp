import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});

const getBody = (data) => {
    return {
        name: data.title,
        description: data.description,
        images: data.image ? [data.image.url] : [],
    };
};

const createProduct = async (data) => {
    const product = await stripe.products.create(getBody(data));
    return product.id;
};

const updateProduct = async (productId, data) => {
    await stripe.products.update(productId, getBody(data));
};

const deactivateExistingPrices = async (productId) => {
    const prices = await stripe.prices.list({ product: productId });
    const defaultPriceId = prices.data.find(price => price.id === prices.data[0].id).id;
    for (const price of prices.data) {
        if (price.id !== defaultPriceId) {
            await stripe.prices.update(price.id, { active: false });
        }
    }
    await stripe.products.update(productId, { default_price: null });
};

const createPrice = async (productId, amount) => {
    const price = await stripe.prices.create({
        unit_amount: amount * 100,
        currency: "EUR",
        product: productId,
    });
    await stripe.products.update(productId, { default_price: price.id });
};

export default {
    beforeUpdate: async (event) => {
        const { data } = event.params;

        if (!data.product_id) {
            event.params.data.product_id = await createProduct(data);
        } else {
            const existingPrices = await stripe.prices.list({
                product: data.product_id,
                limit: 1,
            });

            const currentPrice = existingPrices.data[0];
            const newPriceAmount = data.price * 100;

            if (!currentPrice || currentPrice.unit_amount !== newPriceAmount) {
                await deactivateExistingPrices(data.product_id);
                await createPrice(data.product_id, data.price);
            }

            await updateProduct(data.product_id, data);
        }
    },

    afterDelete: async (event) => {
        const { where } = event.params;
        if (where.product_id) {
            await stripe.products.update(where.product_id, { active: false });
        }
    },
};
