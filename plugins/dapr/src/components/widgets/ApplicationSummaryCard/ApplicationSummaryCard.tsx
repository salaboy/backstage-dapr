import React, { useEffect, useState } from 'react';
import { EmptyState, InfoCard, StructuredMetadataTable } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export const DARP_APPLICATION_ID = 'dapr.io/application-id';

export const isDarpAvailable = (entity: { metadata: { annotations?: Record<string, string> } }) =>
  Boolean(entity?.metadata.annotations?.[DARP_APPLICATION_ID]);

export interface ApplicationInstance {
  appID: string;
  httpPort: number;
  grpcPort: number;
  appPort: number;
  command: string;
  age: string;
  created: string;
  pid: number;
  replicas: number;
  address: string;
  supportsDeletion: boolean;
  supportsLogs: boolean;
  manifest: JSX.Element; // Cambiar el tipo de 'manifest' a JSX.Element
  status: string;
  labels: string;
  selector: string;
  config: string;
}

export const ApplicationSummaryCard = () => {
  const { entity } = useEntity();
  const discoveryApi = useApi(discoveryApiRef);
  const [data, setData] = useState<ApplicationInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openManifest, setOpenManifest] = useState(false);

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
        const response = await fetch(`${baseUrl}/instances/All/${appId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const result: ApplicationInstance = await response.json();

        // Crear el JSX para el manifiesto, que incluye el botón
        result.manifest = (
          <>
            <Button color="primary" onClick={() => setOpenManifest(true)}>
              Show Manifest
            </Button>

            {/* Popup que muestra el manifiesto completo */}
            <Dialog open={openManifest} onClose={() => setOpenManifest(false)}>
              <DialogTitle>Manifest</DialogTitle>
              <DialogContent>
                <pre>{result.manifest}</pre>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenManifest(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );

        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [discoveryApi, entity, isAvailable, openManifest]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <EmptyState missing="data" title="No data to show" description='Check if the application_id is correct or if there is any connectivity issue with the Dapr API' />;
  }

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  return (
    <InfoCard title="Darp Application Instance">
      <Box position="relative">
        <StructuredMetadataTable metadata={data} />
      </Box>
    </InfoCard>
  );
};
