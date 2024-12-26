import React from 'react';

import { Entity } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState, useEntity } from '@backstage/plugin-catalog-react';
import {
    LinkButton,
} from '@backstage/core-components';

import {
    DAPR_APPLICATION_ID
} from './daprAppData';
import { Dapr } from './Dapr';

export * from './daprAppData';

/**
 * Returns true if the catalog entity contains the dapr annotation `dapr.io/application-id`.
 *
 * @public
 */
export const isDaprAvailable = (entity: Entity) =>
    Boolean(entity?.metadata.annotations?.[DAPR_APPLICATION_ID]);

export const Router = () => {
    const { entity } = useEntity();

    if (isDaprAvailable(entity)) {
        return <Dapr />;
    }

    return (
        <>
            <MissingAnnotationEmptyState
                annotation={DAPR_APPLICATION_ID}
            />
            <LinkButton
                variant="contained"
                color="primary"
                to="https://github.com/salaboy/backstage-dapr/blob/main/README.md"
            >
                Read Dapr Plugin Docs
            </LinkButton>
        </>
    );
};