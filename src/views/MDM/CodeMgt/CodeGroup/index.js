import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import  {CodeGroupContext}  from './CodeGroupContext';
import CodeMgtSearch from './CodeGroupSearch';
import CodeMgtTable from './CodeGroupTable';
import CodeMgtDetail from './CodeGroupDetail';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const CodeMgtView = ({setGrpId}) => {
  const classes = useStyles();
  return (
    <CodeGroupContext>
        <Page className={classes.root} title="화면 관리">
          <Container maxWidth={false}>
            <Box>
              <CodeMgtSearch  setGrpId={setGrpId}/>
            </Box>
            <Box mt={1}>
              <CodeMgtTable  setGrpId={setGrpId}/>
            </Box>
            <Box mt={1}>
              <CodeMgtDetail setGrpId={setGrpId}/>
            </Box>
          </Container>
        </Page>
     </CodeGroupContext>
  );
};

export default CodeMgtView;
