import React from 'react';
import { Box, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';
import AreaNat from 'src/views/MDM/AreaMgt/AreaNat';
import AreaCity from 'src/views/MDM/AreaMgt/AreaCity';
import AreaCounty from 'src/views/MDM/AreaMgt/AreaCounty';
import { AreaGlobalContext } from './AreaGlobalContext';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    display:"flex",

    justifyContent:"space-between",
    alignItems:"center",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  container:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  },
  boxColumn:{
    display:"flex",
    width:"60%"
  },
  w1600boxColumn:{
    display:"flex",
  },
  w820boxColumn:{
    
  }

}));

const AreaMgtView = () => {
  const classes = useStyles();
  
  const media = {
    w1600 : useMediaQuery('(min-width:1600px)'),
    w820 : useMediaQuery('(min-width:820px)'),
  }

  return (

  <AreaGlobalContext>
      <Page className={classes.root} title="화면 관리">
        <Container className={media.w1600? classes.container:null} maxWidth={false}>
            <Box style={{width:media.w1600?"40%":null}}>
              <AreaNat    />
            </Box>
            <Box className={media.w1600? classes.boxColumn:media.w820 ?classes.w1600boxColumn :classes.w820boxColumn}>
              <Box style={{width:media.w820 ?"50%":null}} >
                <AreaCity />
              </Box>
              <Box style={{width:media.w820 ?"50%":null}} >
                <AreaCounty/>
              </Box>
            </Box>
        </Container>
      </Page>
  </AreaGlobalContext>
  );
};

export default AreaMgtView;
