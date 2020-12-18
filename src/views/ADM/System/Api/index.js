import React, { useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import ApiTable from './ApiTable';
import ApiSearch from './ApiSearch';
import ApiDetail from './ApiDetail';
import { useQuery } from '@apollo/react-hooks';
import { MDLE_CD } from './ApiQuery';
import { ApiContext } from './ApiContext';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const ApiView = () => {
  const classes = useStyles();

  const { data: mdleType } = useQuery(MDLE_CD);
const [api,setApi] = useState()
console.log(api)
  return (
    <ApiContext>
      <Page className={classes.root} title="운영자 관리">
        <Container maxWidth={false}>
          <Box>
            <ApiSearch mdleType={mdleType} />
          </Box>
          <Box mt={1}>
            <ApiTable setApi={setApi}/>
          </Box>
          <Box mt={1}>
            <ApiDetail api={api} mdleType={mdleType} />
          </Box>
        </Container>
      </Page>
    </ApiContext>
  );
};

export default ApiView;
