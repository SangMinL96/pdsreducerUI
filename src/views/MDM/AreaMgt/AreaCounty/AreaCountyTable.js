import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './AreaCountyContext';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_COUNTY_DATA, COUNTY_DEL } from './AreaCountyQuery';
import { toast } from 'react-toastify';
import { tableRemoveDispatch, tableSelectDispatch} from "./AreaCountyComponent/AreaCountyUtils"
import { titleStyle } from './AreaCountyComponent/AreaCountyStyle';
import { useGlobalDispatch, useGlobalState } from '../AreaGlobalContext';
import { netError } from 'src/components/netErrorHendle';

const AreaCountyCloumns = [
  {
    headerName: '시군구ID',
    field: 'AREA_ID',            
    checkboxSelection: true,
    headerCheckboxSelection: true,
    
  },
  {
    headerName: '시군구명',
    field: 'AREA_NM'
  },
  {
    headerName: '등록일',
    field: 'REG_DT'
  },
];
const AreaCountyTable = () => {
  const dispatch = useDataDispatch();
  const globalDispatch = useGlobalDispatch()
  const classes = titleStyle();
  const { gridData, selClear,selFocus,subMitFlag } = useDataState(); //Context컴포넌트안에 리듀서 State 값을 가져옴. 
  const {county_urp_id,countyReset} =useGlobalState()
  const [gridApi, setGridApi] = useState(null); // AG 그리드 함수
  const [removeCounty, setRemoveCounty] = useState([]); // 선택한 데이터를 배열로 모아 삭제

  const [delMutation] = useMutation(COUNTY_DEL, { // 선택한 데이터 삭제
    variables: {
      ver: 'v1',
      area:{AREA_IDS:removeCounty},
    }
  });
  const { data,refetch,error } = useQuery(GET_COUNTY_DATA, {  // 데이터 삭제시 그리드 테이블 리프레쉬
    fetchPolicy: 'network-only',
    skip:county_urp_id ===undefined,
    variables: { param: { AREA_TP_CD: '003',UPR_AREA_ID: county_urp_id},ver: 'v1'}
   });
 
  
  useEffect(() => {
    if (selClear) { //조회시 선택된 셀 전부 해제
      gridApi.deselectAll();
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      })
    }
    if(selFocus.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
        gridApi.forEachNode((node)=>node.setSelected(node.data.AREA_ID === selFocus.id)) 
    }
    if(subMitFlag.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }
    if (data !== undefined) {
        dispatch({
        type: 'GET_GRID_DATA',
        gridData: data?.getArea
      });
    }
    if(countyReset ===true){
      globalDispatch({
        type: "COUNTY_URP_ID",
        cityUrpId:undefined
      })
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: []
      });
      globalDispatch({
        type: "COUNTY_RESET",
        boolean:false
      })
    }
  if (error !== undefined) {
      netError(error)
    }
  }, [selClear,error,data,globalDispatch,countyReset, dispatch,selFocus,gridData,subMitFlag,gridApi]);
 


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
          type: 'COUNTY_DETAIL',
          countyDetail: ev.data
        })
    }
    dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
      type: 'SEL_FOCUS_RESET',
    });
    const clickCountyData = gridApi.getSelectedRows().map(data => data.AREA_ID);
    setRemoveCounty(clickCountyData);
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
            console.dir(result)
             if(result.data.delArea.rsltCd==="OK"){
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
    width: 142,
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
                disabled={removeCounty.length > 0 ? false :true}
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
            style={{ position: 'relative', height: '575px', width: '100%' }}
          >
            <AgGridReact
              headerHeight={35}
              onRowClicked={onRowClickd}
              onRowSelected={onRowSelected}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '시도를 클릭해주세요.' }}
              columnDefs={AreaCountyCloumns}
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

AreaCountyTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(AreaCountyTable);



