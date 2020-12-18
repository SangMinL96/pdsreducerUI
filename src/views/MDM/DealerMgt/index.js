import React, { useState } from 'react';
import { Box, Card, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { DealerContext } from './DealerContext';

import DealerTable from './DealerTable';
import DealerDetail from './DealerDetail';
import { GET_AREA, GET_UPR_AREA, USER_DATA,DLR_TP_CD } from './DealerQuery';
import DetailTree from './DealerComponent/DetailTree';

const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height:"100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    display:"flex",
    alignItems:"center",
  
  },
  w630page:{
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height:"100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
   
  },
  treeContainer:{
    width:"250px",
    marginLeft:"2em",
    height:"90.5%"
  },
  w630treeContainer:{
    width:"92%",
    marginBottom:"1em",
    overflow:"visible"
  
  },
  gridContainer:{
    width:"100%",
    height:"91%"
  }
}));

const DealerView = () => {
  const media = {
    w630 : useMediaQuery('(min-width:630px)'),
  
  }
const [cityUrpId,setCityUrpId]=useState('')
const [countyUrpId,setCountyUrpId]=useState('')

  const { data: areacode } = useQuery(GET_AREA, {
    variables: {
      param: { AREA_TP_CD: '001' },
      ver: 'v1'
    }
  });
  const { data: cityCode } = useQuery(GET_UPR_AREA, { // 국가 선택시 skip 값이 false로 바껴 쿼리 실행. 국가 선택에 따라 시도 선택 목록이 바뀜.
    returnPartialData: true,
    skip: cityUrpId === '' ||  cityUrpId === undefined,
    variables: {
      param: {
        AREA_TP_CD: '002',
        UPR_AREA_ID: cityUrpId
      },
      ver: 'v1'
    }
  });
  const { data: countyCode } = useQuery(GET_UPR_AREA, { // 국가 선택시 skip 값이 false로 바껴 쿼리 실행. 국가 선택에 따라 시도 선택 목록이 바뀜.
    returnPartialData: true,
    skip: countyUrpId === '' ||  countyUrpId === undefined,
    variables: {
      param: {
        AREA_TP_CD: '003',
        UPR_AREA_ID: countyUrpId
      },
      ver: 'v1'
    }
  });
  const {data:getUser} =useQuery(USER_DATA ,{ // 국가 선택시 skip 값이 false로 바껴 쿼리 실행. 국가 선택에 따라 시도 선택 목록이 바뀜.
    returnPartialData: true,
    variables: {
      param: { USR_ID: "",USR_TP_CD:"U001"},
      ver: 'v1'
    }
  })
  const { data: dlr_tp_cd } = useQuery(DLR_TP_CD);

  const classes = useStyles();
  return (
    <DealerContext>

      <Page className={media.w630 ? classes.page:classes.w630page}>
        <Card className={media.w630 ?classes.treeContainer:classes.w630treeContainer}>
          <DetailTree/>
        </Card>
        <Container maxWidth={false} className={classes.gridContainer}>
          <Box >
            <DealerTable />
          </Box>
          <Box mt={1}>
            <DealerDetail setCityUrpId={setCityUrpId} setCountyUrpId={setCountyUrpId} getUser={getUser} areacode={areacode} cityCode={cityCode} countyCode={countyCode} dlr_tp_cd={dlr_tp_cd} />
          </Box>
        </Container>
      
      </Page>
    </DealerContext>
  );
};

export default DealerView;
