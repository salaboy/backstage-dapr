import React, { useEffect, useState } from 'react';
import { EmptyState, Table } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';
import { ApplicationMetadata, Subscription } from '../../types';
import { columns, useStyles } from './tableHeading';

export const DARP_APPLICATION_ID = 'dapr.io/application-id';

export const isDarpAvailable = (entity: { metadata: { annotations?: Record<string, string> } }) =>
  Boolean(entity?.metadata.annotations?.[DARP_APPLICATION_ID]);

export const ApplicationSubscriptionsCard = () => {
  const { entity } = useEntity();
  const discoveryApi = useApi(discoveryApiRef);
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles();

  const isAvailable = isDarpAvailable(entity);

  useEffect(() => {
    if (!isAvailable) {
      setLoading(false);
      setError(`Annotation "${DARP_APPLICATION_ID}" is not present on the entity.`);
      return;
    }

    const fetchData = async () => {
      try {
        const baseUrl = `${await discoveryApi.getBaseUrl('proxy')}/dapr/api`;
        const appId = entity.metadata.annotations![DARP_APPLICATION_ID];
        const response = await fetch(`${baseUrl}/metadata/All/${appId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const result: ApplicationMetadata = await response.json();

        setData(result.subscriptions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Table options={{
      paging: false
    }} data={[]} columns={columns} emptyContent={<div className={classes.empty}>
            <EmptyState missing="data" title="No data to show" description='Check if the application_id is correct or if there is any connectivity issue with the Dapr API' />;
          </div>} title="Subscriptions" />;
  }

  if (!data) {
    return <Table options={{
      paging: false
    }} data={[]} columns={columns} emptyContent={<div className={classes.empty}>
            <EmptyState missing="data" title="No data to show" description='Check if the application_id is correct or if there is any connectivity issue with the Dapr API' />;
          </div>} title="Subscriptions" />;
  }

  return (
    <Table
        title="Subscriptions"
        options={{ sorting: true, paging: true, padding: 'dense' }}
        data={data}
        columns={columns}
      />
  );
};


