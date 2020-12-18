import React, { useState } from 'react';
import { Box, Container, makeStyles, useMediaQuery } from '@material-ui/core';
import Page from 'src/components/Page';
import CodeGroup from 'src/views/MDM/CodeMgt/CodeGroup';
import CodeList from 'src/views/MDM/CodeMgt/CodeList';
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

}));

const CodeMgtView = () => {
  const classes = useStyles();
  const [grpId,setGrpId]=useState()
  const media = {
    w1200 : useMediaQuery('(min-width:1200px)'),
  }
  
  return (
   
      <Page className={classes.root} title="화면 관리">
        <Container className={media.w1200? classes.container:null} maxWidth={false}>
          <Box style={{width:media.w1200?"40%":null}}>
            <CodeGroup  setGrpId={setGrpId}/>
          </Box>
          <Box style={{width:media.w1200?"60%":null}} >
            <CodeList grpId={grpId}/>
          </Box>
        </Container>
      </Page>
    
  );
};

export default CodeMgtView;
