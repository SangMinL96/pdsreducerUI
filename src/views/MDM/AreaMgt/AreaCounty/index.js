import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';



import {AreaCountyContext} from "./AreaCountyContext"
import AreaCountyTable from './AreaCountyTable';
import AreaCountyDetail from './AreaCountyDetail';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
   
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const AreaCountyView = () => {

  const classes = useStyles();
  return (
   <AreaCountyContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <AreaCountyTable  />
          </Box>
          <Box mt={1}>
            <AreaCountyDetail  />
          </Box>
        </Container>
      </Page>
</AreaCountyContext>
  );
};

export default AreaCountyView;
