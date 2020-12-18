import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './JoinUserContext';
import { tableSelectDispatch } from './JoinUserComponent/JoinUserUtil';
import { tableStyle } from './JoinUserComponent/JoinUserStyle';
import { serviceValue } from 'src/components/Utils';

 const JoinUserCloumns = [
  {
    headerName: '서비스',
    field: 'USE_SVC_CD_LST',
    valueGetter: function(params) {
      return serviceValue(params.data.USE_SVC_CD_LST);
    },

    checkboxSelection: true,
    headerCheckboxSelection: true,
    suppressSizeToFit: true
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
    headerName: '인증유형',

    field: 'AUTH_TP_NM'
  },
  {
    headerName: 'HP',

    field: 'HP'
  },
  {
    headerName: 'EMAIL',

    field: 'EML'
  },
  {
    headerName: '닉네임',

    field: 'NIC_NM'
  },
  {
    headerName: '홈샵',

    field: 'HME_SHP_NM'
  },
  {
    headerName: '상태',

    field: 'USR_ST_CD'
  }
];

const JoinUserTable = () => {
  const classes = tableStyle();
  const dispatch = useDataDispatch();
  const { gridData, selClear,selFocus } = useDataState();
  const [gridApi, setGridApi] = useState(null); // AG 그리드 라이브러리 이벤트 사용시 필요한 함수

  useEffect(() => {
    if (selClear) {
      gridApi.deselectAll();
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      })
    }
    if(selFocus.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
      gridApi.forEachNode((node)=>node.setSelected(node.data.USR_ID===selFocus.id))
    }
  
  }, [selClear,dispatch,selFocus,gridData, gridApi]);

  const onRowClickd = ev => {
      const userId = ev.data.USR_ID;
      tableSelectDispatch(userId,ev.data,dispatch)
    }
  
   
  const onRowSelected=(ev)=>{
    if(selFocus.flag ===true){
      dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
        type: 'USER_DETAIL',
        userDetail: ev.data
      });
      dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
        type: 'SEL_FOCUS_RESET',
      });
    }
  }
  function onGridReady(params) {
    setGridApi(params.api);
  }
  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    resizable: true,
    filter: true,
    width:176,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' }
  };

  return (
    <>
      <Card >
        {/* TopBar 박스 */}
        <Box className={classes.topBarBox}>
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
        </Box>
        {/* TopBar 박스 */}

        {/* Ag그리드 박스 */}
        <Box >
          <div
            className="ag-theme-alpine"
            style={{ position: 'relative', height: '460px', width: '100%' }}
          >
            <AgGridReact
            headerHeight={35}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={JoinUserCloumns}
              onRowClicked={onRowClickd}
              onRowSelected={onRowSelected}
              pagination={true}
              paginationPageSize={10}
              gridOptions={{ rowHeight: 36 }}
            />
          </div>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

JoinUserTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(JoinUserTable);

//스타일 컴포넌트

