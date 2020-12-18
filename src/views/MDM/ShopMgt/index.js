import React, { useState } from 'react';
import { Box, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { ShopContext } from './ShopContext';

import ShopTable from './ShopTable';
import ShopDetail from './ShopDetail';
import { GET_AREA, GET_UPR_AREA, GET_DEALER_DATA, SHP_CTG_CD } from './ShopQuery';

import ShopSearch from './ShopSearch';
import { areaVariables, variables } from './ShopComponent/ShopUtils';


const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height:"100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  }
}));

const ShopView = () => {
  const media = {
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
    w490 :useMediaQuery('(min-width:490px)'),
  }
const [cityUrpId,setCityUrpId]=useState('')
const [countyUrpId,setCountyUrpId]=useState('')
const { data: areacode } = useQuery(GET_AREA, variables({ AREA_TP_CD: '001' }));
const { data: dlrData } = useQuery(GET_DEALER_DATA, variables({DLR_TP_CD: "" }));
const { data: cityCode } = useQuery(GET_UPR_AREA, areaVariables("002",cityUrpId));
const { data: countyCode } = useQuery(GET_UPR_AREA, areaVariables("003",countyUrpId));
const { data: shp_ctg_cd } = useQuery(SHP_CTG_CD);
const classes = useStyles();
  return (
    <ShopContext>
      <Page className={classes.page}>
        <Container maxWidth={false} className={classes.gridContainer}>
        <Box>
        <ShopSearch media={media} areacode={areacode} shp_ctg_cd={shp_ctg_cd}/>
          </Box>
          <Box mt={1} >
            <ShopTable />
          </Box>
          <Box mt={1}>
            <ShopDetail media={media} setCityUrpId={setCityUrpId} setCountyUrpId={setCountyUrpId}  areacode={areacode} dlrData={dlrData} cityCode={cityCode} countyCode={countyCode} shp_ctg_cd={shp_ctg_cd}  />
          </Box>
        </Container>
      
      </Page>
    </ShopContext>
  );
};

export default ShopView;
