import React, { useState } from 'react';
import {  Container, makeStyles, Grid } from '@material-ui/core';
import Page from 'src/components/Page';
import ScrnTable from './ScrnTable';
import ScrnSearch from './ScrnSearch';
import ScrnDetail from './ScrnDetail';
import { useQuery } from '@apollo/react-hooks';
import { SVC_CD } from './ScrnQuery';
import { ScrnContext } from './ScrnContext';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const ScrnView = () => {
  const classes = useStyles();

  const { data: svcCd } = useQuery(SVC_CD);
  const [scrn,setScrn] = useState()
  console.log(scrn)
  return (
    <ScrnContext>
      <Page className={classes.root} title="화면관리">
        <Container maxWidth={false}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ScrnSearch svcCd={svcCd} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <ScrnTable setScrn={setScrn}/>
                </Grid>
                <Grid item xs={6}>
                  <ScrnDetail scrn={scrn} svcCd={svcCd} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </ScrnContext>
  );
};

export default ScrnView;
