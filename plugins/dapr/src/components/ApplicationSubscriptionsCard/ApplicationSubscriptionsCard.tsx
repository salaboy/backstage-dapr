import React, { useEffect, useState } from 'react';
import { EmptyState, Table } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Typography } from '@material-ui/core';
import { columns, useStyles } from './tableHeading';
import { daprApiRef } from '../../api';
import { Subscription } from '../../types';
import { daprApplicationId } from '../../utils/isDaprAvailable';

export const ApplicationSubscriptionsCard = () => {
  const applicationId = daprApplicationId();
  const DaprAPI = useApi(daprApiRef);
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DaprAPI.getApplicationMetadata(applicationId);

        if (!response) {
          throw new Error(`Wrong application id`);
        }

        setData(response.subscriptions);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
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
    return (
      <Table
        options={{
          paging: false,
        }}
        data={[]}
        columns={columns}
        emptyContent={
          <div className={classes.empty}>
            <EmptyState
              missing="data"
              title="No data to show"
              description="Check if the application_id is correct or if there is any connectivity issue with the Dapr API"
            />
            ;
          </div>
        }
        title="Subscriptions"
      />
    );
  }

  if (!data) {
    return (
      <Table
        options={{
          paging: false,
        }}
        data={[]}
        columns={columns}
        emptyContent={
          <div className={classes.empty}>
            <EmptyState
              missing="data"
              title="No data to show"
              description="Check if the application_id is correct or if there is any connectivity issue with the Dapr API"
            />
            ;
          </div>
        }
        title="Subscriptions"
      />
    );
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
