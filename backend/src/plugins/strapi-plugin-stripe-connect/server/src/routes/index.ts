import adminAPIRoutes from './admin-api';
import contentAPIRoutes from './content-api';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  admin: {
    type: "admin",
    routes: adminAPIRoutes,
  },
};

export default routes;
