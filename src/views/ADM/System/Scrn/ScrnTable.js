import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GET_SCRN, DEL_SCRN } from './ScrnQuery';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './ScrnContext';
import {  netError } from 'src/components/netErrorHendle';
import { param } from './ScrnComponent/ScrnUtil';
import { toast } from 'react-toastify';
import { dataRemoveHandler } from 'src/components/Utils';
import { tableStyle } from './ScrnComponent/ScrnStyle';

const ScrnColumns = [
  {
    headerName: 'ID',
    field: 'SCRN_ID',
    checkboxSelection: true,
    headerCheckboxSelection: true
  },
  {
    headerName: 'SCRN 명',
    field: 'SCRN_NM'
  },
  {
    headerName: '링크경로',
    field: 'SCRN_LNK_PTH'
  },
  {
    headerName: '서비스',
    field: 'SVC_NM'
  },
  {
    headerName: '화면 설명',
    field: 'SCRN_DESC'
  }
];

const ScrnTable = () => {
  const classes = tableStyle();
  const dispatch = useDataDispatch();
  const {scrnDetailData, gridData, selClear,subMitFlag,selFocus } = useDataState();
  const [gridScrn, setGridScrn] = useState(null); // AG 그리드 라이브러리 이벤트 사용시 필요한 함수
  const [removeScrnData, setRemoveScrnData] = useState([]); // Detail 컴포넌트에서 보낸 삭제 유저 정보를 받아 현재 테이블과 비교하여 실시간으로 유저 정보 삭제 
  const {data,refetch } = useQuery(GET_SCRN, {
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [delMutation, { error }] = useMutation(DEL_SCRN, {
    variables: {
      screen: { SCRN_IDS: removeScrnData },
      ver: 'v1'
    }
  });


  useEffect(() => {
 
    if (selClear) {
      gridScrn.deselectAll();
    }
  
    if(selFocus?.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
       gridScrn.forEachNode((node)=>node.setSelected(node.data.SCRN_ID===selFocus.id))
      }
    
 
    if(subMitFlag?.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridScrn.deselectAll();
    }
    if (error !== undefined) {
      netError(error)
    }

  }, [selClear, error,gridScrn,gridData,selFocus,subMitFlag,data, scrnDetailData]);

  const onRowClickd =useCallback( ev => {
    dispatch({
      type: 'SUBMET_RESET'
   });
      dispatch({
        type: 'SCRN_DETAIL',
        scrnDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
    
    },[dispatch]);
  

  const onRowSelected=useCallback( ev =>{
    if(selFocus?.flag ===true){
    
        dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
          type: 'SCRN_DETAIL',
          scrnDetail: ev.data
        });
        dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
          type: 'SEL_FOCUS_RESET',
        });
      
    }
    const clickData = gridScrn.getSelectedRows().map(data => data.SCRN_ID);
    setRemoveScrnData(clickData);
  },[gridScrn,dispatch,selFocus ]);


  const onRemove = () => {
    confirmAlert({
      title: '삭제',
      message: '정말 삭제 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: async () => {
            try {
              dispatch({
                type: 'SCRN_DETAIL_RESET'
              });
              dispatch({
                type: 'READ_ONLY'
              });
              dispatch({
                type: 'SUBMET_RESET'
              });
              const data = await delMutation();
              const result = data?.data?.delScreen?.rsltCd
              dataRemoveHandler(result,toast,refetch)
            } catch (error) {
              toast.error("다시시도 해주세요.")
              console.log(error);
            }
          }
        },
        {
          label: '아니요'
        }
      ]
    });
  };

  function onGridReady(params) {
    setGridScrn(params.api);

  }

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
    width: 200
  };

  return (
    <>
      <Card>
        {/* TopBar 박스 */}
        <Box className={classes.TopBarBox}>
          <div>
            <h3>
              총
              {gridData?.length > 0 ? (
                <span>{gridData?.length}</span>
              ) : (
                <span>0</span>
              )}
              건
            </h3>
          </div>
          <div>
              <Button
              className={classes.button}
                onClick={onRemove}
                type="submit"
                variant="contained"
                color="primary"
                disabled={removeScrnData.length > 0 ? false :true}
              >
                삭제
              </Button>
          </div>
        </Box>
        {/* TopBar 박스 */}

        {/* Ag그리드 박스 */}
        <Box>
          <Box
            className="ag-theme-alpine"
            style={{ position: 'relative', height: '700px', width: '100%' }}
          >
            <AgGridReact
              headerHeight={35}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={ScrnColumns}
              onRowClicked={onRowClickd}
              onRowSelected={onRowSelected}
              pagination={true}
              paginationPageSize={10}
              gridOptions={{ rowHeight: 38 }}
             
            />
          </Box>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

ScrnTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(ScrnTable);

//스타일 컴포넌트
