import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { GET_AREA_TREE, GET_DEALER_DATA } from '../DealerQuery';
import { useDataDispatch } from '../DealerContext';
import { netError } from 'src/components/netErrorHendle';

const treeStyle = makeStyles(props => ({
  treeBox:{
   marginTop:"5px",
    '& .MuiTreeItem-label':{
      fontSize:"15px"
    }
  }

}));

export default function DetailTree() { 
  
  const classes = treeStyle();
  const dispatch = useDataDispatch();
  const [selected, setSelected] = useState();
  const { data:gridData,error } = useQuery(GET_DEALER_DATA, {
    returnPartialData: true,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: selected === undefined, 
    variables: {
      param:selected,
      ver: 'v1'
    }
  });
  const { data: TreeData } = useQuery(GET_AREA_TREE, {
    variables: {
      AREA_NM: '',
      ver: 'v1'
    }
  });
 
  const data = {
    id: '1',
    name: TreeData?.getAreaTree?.name,
    children: TreeData?.getAreaTree?.children?.map(item => item)
  };


  const areaClick=(ev)=>{
    const NAT_ID = ev.AREA_TP_CD === "001" ?ev.id :undefined
    const STE_ID = ev.AREA_TP_CD === "002" ?ev.id :undefined
    setSelected({NAT_ID,STE_ID})
  }
 
  useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getDealerTree
      });
    }
     if (error !== undefined) {
      netError(error)
    }
  }, [gridData,error,dispatch]);





  
  const renderTree = nodes => (
    
    <TreeItem
      className={classes.treeBox}
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={()=>areaClick(nodes)}
      
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
    style={{padding:"1em"}}
      defaultCollapseIcon={<ExpandMoreIcon />}
      //   defaultExpanded={['0', '3', '4']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}
