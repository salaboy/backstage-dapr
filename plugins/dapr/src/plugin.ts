import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const darpPlugin = createPlugin({
  id: 'darp',
  routes: {
    root: rootRouteRef,
  },
});

export const DarpPage = darpPlugin.provide(
  createRoutableExtension({
    name: 'DarpPage',
    component: () => import('./components/Dapr/Dapr').then(m => m.Dapr),
    mountPoint: rootRouteRef,
  }),
);

