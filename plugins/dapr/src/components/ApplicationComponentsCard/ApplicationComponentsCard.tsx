import React, { useEffect, useState } from 'react';
import { EmptyState, Table } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Typography } from '@material-ui/core';
import { columns, useStyles } from './tableHeading';
import { daprApiRef } from '../../api';
import { daprApplicationId } from '../../utils/isDaprAvailable';
import { Component } from '../../types';

export const ApplicationComponentsCard = () => {
  const applicationId = daprApplicationId();
  const DaprAPI = useApi(daprApiRef);
  const [data, setData] = useState<Component[]>([]);
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

        setData(response.components);
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
        title="Components"
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
        title="Components"
      />
    );
  }

  return (
    <Table
      title="Components"
      options={{ sorting: true, paging: true, padding: 'dense' }}
      data={data}
      columns={columns}
    />
  );
};
