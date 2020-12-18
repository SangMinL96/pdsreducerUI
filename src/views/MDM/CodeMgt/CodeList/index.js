import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';



import {CodeListContext} from "./CodeListContext"
import CodeListTable from './CodeListTable';
import CodeListDetail from './CodeListDetail';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
   
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const CodeListView = ({grpId}) => {
  const classes = useStyles();
  return (
   <CodeListContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <CodeListTable grpId={grpId} />
          </Box>
          <Box mt={1}>
            <CodeListDetail grpId={grpId} />
          </Box>
        </Container>
      </Page>
</CodeListContext>
  );
};

export default CodeListView;
