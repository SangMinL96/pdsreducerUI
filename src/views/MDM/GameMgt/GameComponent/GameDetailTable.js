import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from '../GameContext';
const gameCloumns = [
  {
    headerName: '모델 코드',
    field: 'COM_CD',
    checkboxSelection: true,
    headerCheckboxSelection: true,

  },
  {
    headerName: '모델 명',
    field: 'COM_CD_NM'
  },
 
];

const GameDetailTable = ({mcn_mdl_code,mcnId,setMcnMdlId}) => {
  const dispatch = useDataDispatch();
  const {  selClear,subMitFlag ,inputReadOnly} = useDataState(); //Context컴포넌트안에 리듀서 State 값을 가져옴. 
  const [gridApi, setGridApi] = useState(null); // AG 그리드 함수
  const checkMcnMdl = (mcnId) => {
    gridApi.forEachNode(node => {
      const arr=mcnId !== null ?mcnId.split(",").map( 
        item => item === node.data.COM_CD?true:false
      ):[]
  
      node.setSelected(arr.includes(true))
    })
  }

  
  useEffect(() => {
    if(mcnId !== undefined){
      checkMcnMdl(mcnId)
      }
    
    if (selClear) { //조회시 선택된 셀 전부 해제
      gridApi.deselectAll();
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      })
    }
 
    if(subMitFlag.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }
  }, [selClear,dispatch,subMitFlag,mcnId, gridApi]);



/**
 * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
 * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
 * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
 * @param {object} ev 선택된 데이터의 데이터 값
 */
  const onRowSelected=(ev)=>{
    const clickNtcData = gridApi.getSelectedRows().map(data => data.COM_CD);
    setMcnMdlId(clickNtcData);
  }



  /**
 * Ag 그리드 함수 사용시 필요함 
 */
  function onGridReady(params) {
    setGridApi(params.api);
  }

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 153,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
    cellStyle: () => 
      inputReadOnly ?  null : {'pointer-events': 'none'}
  };

  return (
    <>
      <Card  >
        {/* Ag그리드 박스 */}
        <Box  >
          <div
            className="ag-theme-alpine"
            style={{ position: 'relative', height: '510px', width: '100%' }}
          >
            <AgGridReact
              headerHeight={35}
              onRowSelected={onRowSelected}
              rowMultiSelectWithClick={true}
              suppressRowClickSelection={inputReadOnly ?false : true}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={mcnId !==undefined ? mcn_mdl_code?.getCode:subMitFlag.addFlag ? mcn_mdl_code?.getCode:[]}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={gameCloumns}
              gridOptions={{ rowHeight: 40 }}
            />
          </div>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

GameDetailTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(GameDetailTable);



