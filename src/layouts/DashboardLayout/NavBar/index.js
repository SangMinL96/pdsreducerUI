import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer, Hidden, List, makeStyles } from '@material-ui/core';
import {
  
  ExpandMore,
  ChevronRight,
  BarChartSharp,
  DnsOutlined,
  RemoveOutlined,
  ClearAllOutlined
} from '@material-ui/icons';

import { TreeItem, TreeView } from '@material-ui/lab';
import StyledTreeItem from 'src/components/StyledTreeItem';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

  const NavBar = ({ onMobileClose, openMobile }) => {
    const classes = useStyles();
    const location = useLocation();
    const [usrMnuTree, setUsrMnuTree] = useState(null)

    const USER_MNU = gql`
    query getUserMnu($usrId: String!, $ver: String!) {
      getUserMnu(ver:$ver, USR_ID:$usrId) {
        USR_ID
        MNU_ID
        MNU_NM
        MDLE_CD
        SCRN_LNK_PTH
        PATH
        ICO_PTH
        LVL
      }
    }
  `;
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const { data: usrMnus } = useQuery(USER_MNU, {
    returnPartialData: true,
    skip: userInfo === null,
    variables: { usrId:userInfo?.loginID, ver: 'v1' },
    fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
  });
  const menuIcons = { DnsOutlined, ClearAllOutlined, RemoveOutlined }
  


  var usrMnuTreeList = []
  

    useEffect(() => {
      if (openMobile && onMobileClose) {
        onMobileClose();
      }
      if(usrMnus) {
        let mnus = usrMnus.getUserMnu
        let pmnu = null
        let mdleMnu = null
        for(var i=0; i<mnus.length; i++) {
          if(mnus[i].LVL === 1) {
            mdleMnu = 
              <StyledTreeItem
              key={i+''}
              style={{ marginLeft: '1em' }}
              nodeId={i+''}
              labelText = {mnus[i].MNU_NM}
              labelIcon={menuIcons[mnus[i].ICO_PTH]}
              children={[]}
              />
            usrMnuTreeList.push(mdleMnu)
          } else if (mnus[i].LVL === 2) {
            pmnu = 
              <StyledTreeItem
              key={i+''}
              nodeId={i+''}
              labelText = {mnus[i].MNU_NM}
              labelIcon={menuIcons[mnus[i].ICO_PTH]}
              children={[]}
              />
            mdleMnu.props.children.push(pmnu)
          } else if (mnus[i].LVL === 3) {
              pmnu.props.children.push(
                <Link key={i+'lnk'} to={mnus[i].SCRN_LNK_PTH?mnus[i].SCRN_LNK_PTH:'#none'}>
                  <StyledTreeItem
                  key={i+''}
                  nodeId={i+''}
                  labelText = {mnus[i].MNU_NM}
                  labelIcon={menuIcons[mnus[i].ICO_PTH]}
                  />
                </Link>
              )
          }
        }
        setUsrMnuTree(usrMnuTreeList)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usrMnus, location.pathname]);




  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <List>
        <Box p={2}>
          <Box mt={1}>
            <Link to="/dashboard">
              <TreeItem
                style={{ marginLeft: '1em' }}
                icon={
                  <BarChartSharp
                    style={{ marginRight: '0.6em', fontSize: '1.5rem' }}
                  />
                }
                nodeId="1"
                label="대쉬보드"
              />
            </Link>
          </Box>
          <Box mt={1}>
            <TreeView
              defaultCollapseIcon={<ExpandMore />}
              defaultExpandIcon={<ChevronRight />}
            >
            {usrMnuTree}
            </TreeView>
          </Box>
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
