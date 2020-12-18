import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './ShopContext';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SHOP_DEL, GET_SHOP_DATA } from './ShopQuery';
import { toast } from 'react-toastify';
import { variables} from "./ShopComponent/ShopUtils"
import { tableSelectDispatch,tableRemoveDispatch, selFocusDispatch} from 'src/components/dispatchs';
import { tableStyle } from './ShopComponent/ShopStyle';

const shopCloumns = [
  {
    headerName: '샵 ID',
    field: 'SHP_ID',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    
  },
  {
    headerName: '샵 명',
    field: 'SHP_NM'
  },
   {
    headerName: '샵 카테고리',
    field: 'SHP_CTG_NM'
  },
  {
    headerName: '국가',
    field: 'NAT_NM',            
    
  },
  {
    headerName: '시도',
    field: 'STE_NM'
  },
  {
    headerName: '시군구',
    field: 'CTY_NM'
  },
  {
    headerName: '주소',
    field: 'SHP_ADDR'
  },
  {
    headerName: '딜러유형',
    field: 'DLR_TP_NM'
  },
  {
    headerName: '아이디',
    field: 'DLR_ID'
  },
  {
    headerName: '이름',
    field: 'USR_NM'
  },
  {
    headerName: '머신수',
    field: 'MCM_CNT'
  },
  {
    headerName: '등록일',
    field: 'REG_DT'
  },
];

const ShopTable = () => {
  const dispatch = useDataDispatch();
  const classes = tableStyle();
  const { gridData, selClear,selFocus,subMitFlag } = useDataState(); //Context컴포넌트안에 리듀서 State 값을 가져옴. 
  const [gridApi, setGridApi] = useState(null); // AG 그리드 함수
  const [removeShop, setRemoveShop] = useState([]); // 선택한 데이터를 배열로 모아 삭제
  const [delMutation] = useMutation(SHOP_DEL, { // 선택한 데이터 삭제
    variables: {
      shop: { SHP_IDS: removeShop },
      ver: 'v1'
    },

  });
  const [refetch ] = useLazyQuery(GET_SHOP_DATA,variables({SHP_NM:""}));
  
  useEffect(() => {
    if (selClear) { //조회시 선택된 셀 전부 해제
      gridApi.deselectAll();
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      })
    }
    if(selFocus?.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
      gridApi.forEachNode((node)=>node.setSelected(node.data.SHP_ID === selFocus.id)) 
    }
    if(subMitFlag.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }

    
  }, [selClear,dispatch,selFocus,subMitFlag, gridData,gridApi]);



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
    if(selFocus.flag ===true){ selFocusDispatch(dispatch,ev.data)}
    const clickNtcData = gridApi.getSelectedRows().map(data => data.SHP_ID);
    setRemoveShop(clickNtcData);
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
              
             const result = await delMutation();
              console.log(result)
             if(result.data.delShop.rsltCd==="OK"){
               toast.success("정상적으로 삭제 되었습니다.")
               tableRemoveDispatch(dispatch) //삭제시 필요한 디스패치를 모아둔 함수 
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
                disabled={removeShop.length > 0 ? false :true}
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
              columnDefs={shopCloumns}
              pagination={true}
              paginationPageSize={10}
              gridOptions={{ rowHeight: 40 }}
            />
          </div>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

ShopTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(ShopTable);



