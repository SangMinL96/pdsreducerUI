import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { ADMIN_USER, DEL_USER } from './AdminUserQuery';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './AdminUserContext';
import {  netError } from 'src/components/netErrorHendle';
import { param } from './AdminUserComponent/AdminUserUtil';
import { toast } from 'react-toastify';
import { dataRemoveHandler } from 'src/components/Utils';
import { tableStyle } from './AdminUserComponent/AdminUserStyle';

const AdminUserCloumns = [
  {
    headerName: '유형',
    field: 'USR_TP_NM',
    checkboxSelection: true,
    headerCheckboxSelection: true
  },
  {
    headerName: '아이디',
    field: 'USR_ID'
  },
  {
    headerName: '이름',
    field: 'USR_NM'
  },
  {
    headerName: '소속',
    field: 'BLN_NM'
  },
  {
    headerName: 'HP',
    field: 'HP'
  },
  {
    headerName: 'EMAIL',
    field: 'EML'
  }
];

const AdminUserTable = () => {
  const classes = tableStyle();
  const dispatch = useDataDispatch();
  const { gridData, selClear,subMitFlag,selFocus } = useDataState();
  const [gridApi, setGridApi] = useState(null); // AG 그리드 라이브러리 이벤트 사용시 필요한 함수
  const [removeUserData, setRemoveUserData] = useState([]); // Detail 컴포넌트에서 보낸 삭제 유저 정보를 받아 현재 테이블과 비교하여 실시간으로 유저 정보 삭제 
  const [refetch ] = useLazyQuery(ADMIN_USER, {
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
  });
  const [delMutation, { error }] = useMutation(DEL_USER, {
    variables: {
      user: { USR_IDS: removeUserData },
      ver: 'v1'
    }
  });


  useEffect(() => {
 
    if (selClear) {
      gridApi.deselectAll();
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      })
    }
  
    if(selFocus?.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
       gridApi.forEachNode((node)=>node.setSelected(node.data.USR_ID===selFocus.id))
      }
    
 
    if(subMitFlag?.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }
    if (error !== undefined) {
      netError(error)
    }

  }, [selClear,dispatch, error,gridApi,gridData,selFocus,subMitFlag, ]);

  const onRowClickd =useCallback( ev => {
    dispatch({
      type: 'SUBMET_RESET'
   });
      dispatch({
        type: 'USER_DETAIL',
        userDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
    
    },[dispatch]);
  

  const onRowSelected=useCallback( ev =>{
    if(selFocus?.flag ===true){
    
        dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
          type: 'USER_DETAIL',
          userDetail: ev.data
        });
        dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
          type: 'SEL_FOCUS_RESET',
        });
      
    }
  
    const clickData = gridApi.getSelectedRows().map(data => data.USR_ID);
    setRemoveUserData(clickData);
  },[gridApi,dispatch,selFocus ]);


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
                type: 'USER_DETAIL_RESET'
              });
              dispatch({
                type: 'READ_ONLY'
              });
              dispatch({
                type: 'SUBMET_RESET'
              });
              const data = await delMutation();
              const result = data?.data?.delUser?.rsltCd
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
    setGridApi(params.api);

  }

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
    width: 265
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
                disabled={removeUserData.length > 0 ? false :true}
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
            style={{ position: 'relative', height: '480px', width: '100%' }}
          >
            <AgGridReact
           headerHeight={35}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={AdminUserCloumns}
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

AdminUserTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(AdminUserTable);

//스타일 컴포넌트
