import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './MenuContext';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { MENU_DEL, GET_MENU_DATA } from './MenuQuery';
import { toast } from 'react-toastify';
import { tableRemoveDispatch, tableSelectDispatch} from "./MenuComponent/MenuUtils"
import { tableStyle } from './MenuComponent/MenuStyle';

const menuCloumns = [
  {
    headerName: '상위아이디',
    field: 'UPR_MNU_ID',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 200,
    minWidth: 100
  },
  {
    headerName: '메뉴아이디',
    field: 'MNU_ID',
    width: 200,
    minWidth: 100
  },
  {
    headerName: '메뉴명',
    field: 'MNU_NM',
    width: 300,
    minWidth: 100
  },
  {
    headerName: '모듈',
    field: 'MDLE_CD',
    width: 200,
    minWidth: 100
  },
  {
    headerName: '화면아이디',
    field: 'SCRN_ID',
    width: 200,
    minWidth: 100
  },
  {
    headerName: '표시여부',
    field: 'SHOW_YN',
    width: 100,
    minWidth: 100
  }
];

const MenuTable = () => {

  const dispatch = useDataDispatch();
  const classes = tableStyle();
  const { gridData, selClear,selFocus,subMitFlag } = useDataState(); //Context컴포넌트안에 리듀서 State 값을 가져옴. 
  const [gridApi, setGridApi] = useState(null); // AG 그리드 함수
  const [removeMenu, setRemoveMenu] = useState([]); // 선택한 데이터를 배열로 모아 삭제
  const [delMutation] = useMutation(MENU_DEL, { // 선택한 데이터 삭제
    variables: {
      menu: { SHP_IDS: removeMenu },
      ver: 'v1'
    }
  });
  const { refetch } = useLazyQuery(GET_MENU_DATA, {  // 데이터 삭제시 그리드 테이블 리프레쉬
    returnPartialData: true,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip:true,
    variables: {
      param: {SHP_NM:""},
      ver: 'v1'
    }
  });
  
  useEffect(() => {
    if (selClear) { //조회시 선택된 셀 전부 해제
      gridApi.sizeColumnsToFit() 
      gridApi.deselectAll();
    }
    if(selFocus?.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
      gridApi.forEachNode((node)=>node.setSelected(node.data.SHP_ID === selFocus.id)) 
    }
    if(subMitFlag.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }

    
  }, [selClear,selFocus,subMitFlag, gridData,gridApi]);



/**
 * 그리드 데이터 선택 함수.
 * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
 * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
 */
  const onRowClickd = ev => {  tableSelectDispatch(ev,dispatch) };
  
/**
 * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
 * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
 * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
 * @param {object} ev 선택된 데이터의 데이터 값
 */
  const onRowSelected=(ev)=>{
    if(selFocus.flag ===true){
      dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
        type: 'MENU_DETAIL',
        menuDetail: ev.data
      });
      dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
        type: 'SEL_FOCUS_RESET',
      });
     
    }
    const clickNtcData = gridApi.getSelectedRows().map(data => data.SHP_ID);
    setRemoveMenu(clickNtcData);
  }

/**
 * 데이터 삭제 함수 
 */
  const onRemove = () => {
    confirmAlert({
      title: '삭제',
      message: '정말 삭제 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: async () => {
            try {
              tableRemoveDispatch(dispatch) //삭제시 필요한 디스패치를 모아둔 함수 
             const result = await delMutation();
            console.log(result)
             if(result.data.delMenu.rsltCd==="OK"){
               toast.success("정상적으로 삭제 되었습니다.")
             }else{
              toast.error("다시 시도해주세요.")
             }
            } catch (error) {
              console.log(error);
            }
            refetch()
          }
        },
        {
          label: '아니요'
        }
      ]
    });
  };

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
    localeText: { noRowsToShow: '조회 결과가 없습니다.' }
  };

  return (
    <>
      <Card >
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
                disabled={removeMenu.length > 0 ? false :true}
              >
                삭제
              </Button>
           
          </div>
        </Box>
        {/* TopBar 박스 */}

        {/* Ag그리드 박스 */}
        <Box >
          <div
            className="ag-theme-alpine"
            style={{ position: 'relative', height: '550px', width: '100%' }}
          >
            <AgGridReact
            headerHeight={35}
              onRowClicked={onRowClickd}
              onRowSelected={onRowSelected}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={menuCloumns}
              pagination={true}
              paginationPageSize={10}
              gridOptions={{ rowHeight: 35 }}
            />
          </div>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

export default React.memo(MenuTable);



