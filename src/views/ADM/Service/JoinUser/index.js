import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { JoinUserContext } from './JoinUserContext';
import JoinUserSearch from './JoinUserSearch';
import JoinUserTable from './JoinUserTable';
import JoinUserDetail from './JoinUserDetail';
import { SVC_CD, SVC_USE_TP_CD } from './JoinUserQuery';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const JoinUserView = () => {
  const classes = useStyles();
  const { data: svcUseTpCd } = useQuery(SVC_USE_TP_CD);
  const { data: svcCd } = useQuery(SVC_CD);

  return (
    <JoinUserContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <JoinUserSearch svcCd={svcCd} />
          </Box>
          <Box mt={1}>
            <JoinUserTable />
          </Box>
          <Box mt={1}>
            <JoinUserDetail svcCd={svcCd} svcUseTpCd={svcUseTpCd} />
          </Box>
        </Container>
      </Page>
    </JoinUserContext>
  );
};

export default JoinUserView;
