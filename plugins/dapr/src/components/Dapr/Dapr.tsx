import { Content, Page } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React from 'react';
import { ApplicationSummaryCard } from '../widgets/ApplicationSummaryCard';
import { ApplicationActorsCard } from '../widgets/ApplicationActorsCard';
import { ApplicationComponentsCard } from '../widgets/ApplicationComponentsCard';
import { ApplicationSubscriptionsCard } from '../widgets/ApplicationSubscriptionsCard';

export const Dapr = () => (
    <Page themeId="tool">
        <Content>
            <Grid container spacing={6} direction="row" alignItems="stretch">
                <Grid item md={4} xs={12}>
                    < ApplicationSummaryCard/>
                </Grid>
                <Grid item md={8}>
                    < ApplicationComponentsCard/>
                </Grid>
                <Grid item md={8}>
                    < ApplicationSubscriptionsCard/>
                </Grid>
                <Grid item md={4}>
                    < ApplicationActorsCard/>
                </Grid>
            </Grid>
        </Content>
    </Page>
);