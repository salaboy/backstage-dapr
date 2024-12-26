import { createApiRef, DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ApplicationInstance, ApplicationMetadata } from '../components/types';

export interface DaprApi {
    getApplicationInstance(
      application: string
    ): Promise<ApplicationInstance>;
    getApplicationMetadata(
        application: string
    ): Promise<ApplicationMetadata>;
  }

  export const daprApiRef = createApiRef<DaprApi>({
    id: 'plugin.dapr.service',
  });

  export type Options = {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  };

  export class DaprApiClient implements DaprApi {
    // @ts-ignore
    private readonly discoveryApi: DiscoveryApi;
    
    private readonly identityApi: IdentityApi;
  
    constructor(options: Options) {
      this.discoveryApi = options.discoveryApi;
      this.identityApi = options.identityApi;
    }
  
    private async getBaseUrl() {
      return `${await this.discoveryApi.getBaseUrl('proxy')}`;
    }
  
    private async fetcher(url: string) {
      const { token: idToken } = await this.identityApi.getCredentials();
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
      });
      if (!response.ok) {
        throw new Error(
          `failed to fetch data, status ${response.status}: ${response.statusText}`,
        );
      }
      return await response.json();
    }
    
    async getApplicationInstance(
      application: string
    ) {
      const proxyUrl = await this.getBaseUrl();
    
      return (await this.fetcher(
        `${proxyUrl}/api/instances/All/${application}`,
      )) as ApplicationInstance;
    }
  
    async getApplicationMetadata(
        application: string
    ) {
      const proxyUrl = await this.getBaseUrl();
  
      return (await this.fetcher(
        `${proxyUrl}/api/metadata/All/${application}`,
      )) as ApplicationMetadata;
    }
  }