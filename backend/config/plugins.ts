export default ({ env }) => ({
    "video-field": {
        enabled: true
    },
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
    'strapi-plugin-stripe-connect': {
        enabled: true,
        resolve: './src/plugins/strapi-plugin-stripe-connect'
    },
});
