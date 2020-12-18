import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import { useQuery } from '@apollo/react-hooks';
import { NewsContext } from './NewsContext';
import NewsSearch from './NewsSearch';
import NewsTable from './NewsTable';
import NewsDetail from './NewsDetail';
import { GET_AREA, SVC_CD } from './NewsQuery';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const NewsView = () => {
  const { data: areacode } = useQuery(GET_AREA, {
    variables: {
      param: { AREA_TP_CD: '001' },
      ver: 'v1'
    }
  });
  const { data: sve_code } = useQuery(SVC_CD);
  const classes = useStyles();
  return (
    <NewsContext>
      <Page className={classes.root} title="화면 관리">
        <Container maxWidth={false}>
          <Box>
            <NewsSearch sve_code={sve_code} areacode={areacode} />
          </Box>
          <Box mt={1}>
            <NewsTable />
          </Box>
          <Box mt={1}>
            <NewsDetail sve_code={sve_code} />
          </Box>
        </Container>
      </Page>
    </NewsContext>
  );
};

export default NewsView;
