import React, { useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import  {MachineSWContext}  from './MachineSWContext';
import MachineSWSearch from './MachineSWSearch';
import MachineSWTable from './MachineSWTable';
import MachineSWDetail from './MachineSWDetail';
import {  SVC_CD, SW_TP_CD } from './MachineSWQuery';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const MachineSWView = () => {
  
  const { data: svc_code } = useQuery(SVC_CD);
  const { data: sw_tp_code } = useQuery(SW_TP_CD);
const [gridApi,setGridApi]=useState()
  const classes = useStyles();
  return (
    <MachineSWContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <MachineSWSearch svc_code={svc_code} />
          </Box>
          <Box mt={1}>
            <MachineSWTable setGridApi={setGridApi} />
          </Box>
          <Box mt={1}>
            <MachineSWDetail gridApi={gridApi} sw_tp_code={sw_tp_code} svc_code={svc_code} />
          </Box>
        </Container>
      </Page>
    </MachineSWContext>
  );
};

export default MachineSWView;
