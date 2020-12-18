import React, { useState } from 'react';
import { Box, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { MachineSttgContext } from './MachineSttgContext';

import MachineSttgTable from './MachineSttgTable';
import MachineSttgDetail from './MachineSttgDetail';
import { GME_CTG_CODE, MCN_MDL_CODE, SVC_CD_CODE } from './MachineSttgQuery';

import MachineSttgSearch from './MachineSttgSearch';



const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height:"100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  table:{
    width:"50%"
  },
  detail:{
    width:"48%",
   

  }
}));

const MachineSttgView = () => {
  const media = {
    w980:useMediaQuery('(min-width:980px)'),
    w525 :useMediaQuery('(min-width:525px)'),
    w500 :useMediaQuery('(min-width:500px)'),
    w490 :useMediaQuery('(min-width:490px)'),
  }


const { data: svc_code } = useQuery(SVC_CD_CODE);
const { data: gme_ctg_code } = useQuery(GME_CTG_CODE);
const { data: mcn_mdl_code } = useQuery(MCN_MDL_CODE);
const classes = useStyles();
  return (
    <MachineSttgContext>
        <Page className={classes.page}>
            <Container maxWidth={false} className={classes.gridContainer}>
                <Box>
                  <MachineSttgSearch media={media}svc_code={svc_code}/>
                </Box>
                <Box mt={3} display={media.w980 ? "flex" :null} width="100%" justifyContent="space-between">
                <Box  className={media.w980 ? classes.table:null}>
                    <MachineSttgTable />
                  </Box>
                <Box  className={media.w980 ? classes.detail:null}>
                  <MachineSttgDetail media={media}  svc_code={svc_code} mcn_mdl_code={mcn_mdl_code} gme_ctg_code={gme_ctg_code}  />
              </Box>
              </Box>
            </Container>
          </Page>
    </MachineSttgContext>
  );
};

export default MachineSttgView;
