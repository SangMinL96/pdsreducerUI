import React  from 'react';
import { Box, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { MenuContext } from './MenuContext';

import { GET_CODE } from './MenuQuery';

import MenuSearch from './MenuSearch';
import MenuTable from './MenuTable';
import MenuDetail from './MenuDetail';

// TODO : 공통 스타일로 정리
const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height:"100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  }
  }));

  const MenuView = () => {
    const media = {
      w490 :useMediaQuery('(min-width:490px)'),
    }
    const classes = useStyles();
    //서비스 코드 조회
    const { data: svcCdLst, loading:svcLoding, error:svcErr} = useQuery(GET_CODE, {
      variables: {
        COM_CD_GRP_ID: 'SVC_CD',
        ver: 'v1'
      }
    });
    //모듈 코드 조회
    const { data: mdleCdLst, loading:mdleLoding, error:mdleErr} = useQuery(GET_CODE, {
      variables: {
        COM_CD_GRP_ID: 'MDLE_CD',
        ver: 'v1'
      }
    });
    if(svcLoding || mdleLoding) {
      return <p>LOADING ...</p>
    }
    if(svcErr || mdleErr) {
      return <p>COMMON CODE LOADING ERROR !!!</p>
    }

    return (
      <MenuContext>
        <Page className={classes.page}>
          <Container maxWidth={false} className={classes.gridContainer}>
            <Box>
            <MenuSearch media={media} mdleCdLst={mdleCdLst} svcCdLst={svcCdLst}/>
            </Box>
            <Box mt={1} >
              <MenuTable />
            </Box>
            <Box mt={1}>
              <MenuDetail mdleCdLst={mdleCdLst} svcCdLst={svcCdLst}/>
            </Box>
          </Container>
        
        </Page>
      </MenuContext>
    );
};

export default MenuView;
