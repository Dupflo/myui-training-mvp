import { Button } from '@strapi/design-system';
import {
  unstable_useContentManagerContext as useContentManagerContext,
  useFetchClient,
} from '@strapi/strapi/admin';

const StripeConnectButton = () => {
  const { post } = useFetchClient();

  const { form } = useContentManagerContext();

  // Here 'initialData' and 'modifiedData' correspond to 'initialValues' and 'values'.
  const { initialValues } = form as any;

  const handleConnect = async () => {
    try {
      const response = await post('/strapi-plugin-stripe-connect/create-connect-account-link', {
        account: initialValues.connect_id,
      });
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      const response = await post(
        '/strapi-plugin-stripe-connect/create-connect-account-onboarding',
        {
          account: initialValues.connect_id,
        }
      );
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    }
  };

  if (!initialValues.connect_id) return null;
  return (
    <Button fullWidth onClick={handleConnect}>
      Accéder à Stripe Connect
    </Button>
  );
};

export default StripeConnectButton;
