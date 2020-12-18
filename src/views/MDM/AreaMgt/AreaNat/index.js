import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import  {AreaNatContext}  from './AreaNatContext';
import AreaNatSearch from './AreaNatSearch';
import AreaNatTable from './AreaNatTable';
import AreaNatDetail from './AreaNatDetail';
import { GET_CTNT_CD } from './AreaNatQuery';
import { useQuery } from '@apollo/react-hooks';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const AreaNatView = () => {
  
  const { data: ctnt_cd } = useQuery(GET_CTNT_CD);
  const classes = useStyles();
  return (
 <AreaNatContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <AreaNatSearch />
          </Box>
          <Box mt={1}>
            <AreaNatTable  />
          </Box>
          <Box mt={1}>
            <AreaNatDetail ctnt_cd={ctnt_cd}/>
          </Box>
        </Container>
      </Page>
     </AreaNatContext>
  );
};

export default AreaNatView;
