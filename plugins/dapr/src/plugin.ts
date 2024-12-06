import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const daprPlugin = createPlugin({
  id: 'dapr',
  routes: {
    root: rootRouteRef,
  },
});

export const DaprPage = daprPlugin.provide(
  createRoutableExtension({
    name: 'DaprPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
