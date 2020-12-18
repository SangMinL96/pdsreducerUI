import React, { useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import AdminUserTable from './AdminUserTable';
import AdminUserSearch from './AdminUserSearch';
import AdminUserDetail from './AdminUserDetail';
import { useQuery } from '@apollo/react-hooks';
import { USR_TP_CD } from './AdminUserQuery';
import { AdminUserContext } from './AdminUserContext';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const AdminUserView = () => {
  const classes = useStyles();

  const { data: userType } = useQuery(USR_TP_CD);
const [api,setApi] = useState()

  return (
    <AdminUserContext>
      <Page className={classes.root} title="운영자 관리">
        <Container maxWidth={false}>
          <Box>
            <AdminUserSearch userType={userType} />
          </Box>
          <Box mt={1}>
            <AdminUserTable setApi={setApi}/>
          </Box>
          <Box mt={1}>
            <AdminUserDetail api={api} userType={userType} />
          </Box>
        </Container>
      </Page>
    </AdminUserContext>
  );
};

export default AdminUserView;
