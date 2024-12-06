import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { daprPlugin, DaprPage } from '../src/plugin';

createDevApp()
  .registerPlugin(daprPlugin)
  .addPage({
    element: <DaprPage />,
    title: 'Root Page',
    path: '/dapr',
  })
  .render();
