export default [
  {
    method: 'POST',
    path: '/create-connect-account-onboarding',
    handler: 'stripeConnect.createConnectOnboarding',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/create-connect-account-link',
    handler: 'stripeConnect.createConnectAccountLink',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
]