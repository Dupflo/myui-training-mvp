import { Button } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';

const StripeConnectButton = () => {
  const { post } = useFetchClient();

  const handleConnect = async () => {
    try {
      const response = await post('/strapi-plugin-stripe-connect/create-connect-account-link');
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
    }
  };

  return <Button onClick={handleConnect}>Accéder à Stripe Connect</Button>;
};

export default StripeConnectButton;
