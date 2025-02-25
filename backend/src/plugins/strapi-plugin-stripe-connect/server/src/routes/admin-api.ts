export default [
    {
        method: 'POST',
        path: '/create-connect-account-link',
        handler: 'stripeConnect.createConnectAccountLink',
        config: {
            policies: ['admin::isAuthenticatedAdmin'],
        },
    },
]