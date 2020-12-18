import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';



import {AreaCityContext} from "./AreaCityContext"
import AreaCityTable from './AreaCityTable';
import AreaCityDetail from './AreaCityDetail';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
   
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const AreaCityView = () => {
  const classes = useStyles();
  return (
   <AreaCityContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <AreaCityTable  />
          </Box>
          <Box mt={1}>
            <AreaCityDetail />
          </Box>
        </Container>
      </Page>
</AreaCityContext>
  );
};

export default AreaCityView;
