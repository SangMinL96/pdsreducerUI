//############## REACT IMPORT       ################
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
//##################################################

//############## MATERIAL UI IMPORT ################
import {Box,Button,Card,MenuItem,Grid} from '@material-ui/core';

//##################################################

//############## APOLLO IMPORT      ################
import { useLazyQuery } from '@apollo/react-hooks';
//##################################################

//############## UTIL IMPORT        ################
    // import DateFnsUtils from '@date-io/date-fns';
    // import Moment from 'moment'
//##################################################

//############## SRC IMPORT         ################
import { initGrid } from './MenuComponent/MenuUtils';
import ReactHookFormSelect from './MenuComponent/ReactHookFormSelect';
import { useDataDispatch } from './MenuContext';
import { GET_MENU_DATA } from './MenuQuery';
import {searchStyle} from "./MenuComponent/MenuStyle"  // TODO : 공통 스타일로 정리
//###################################################

const MenuSearch = ({ media, mdleCdLst, svcCdLst }) => {
  // TODO : 공통 스타일로 정리
  const classes = searchStyle();

  //Context Dispatch
  const dispatch = useDataDispatch();
  //인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const {  handleSubmit, control } = useForm();
  //조회시 전송 파라미터
  const [searchParam, setSearchParam] = useState({SVC_CD:'', MDLE_CD:''})
  //목록 조회결과 gridData 저장
  const [ loadData, {loading, error, data: gridData} ] = useLazyQuery(GET_MENU_DATA, {
    skip: searchParam === undefined, 
    variables: { searchParam, ver: 'v1' },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
/**
 * SELECT 선택시 입력함수
 * @param {object} event SELECT 선택 Value값
 */
  const selectChange = event => { 
    const { name, value } = event.target
    if(name ==="SVC_CD"){
      console.log(value)      
    }
    if(name ==="MDLE_CD"){
      console.log(value)      
    }
  };
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 GET_MENU_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const search = formdata => { 
    var param={};
    param.SVC_CD = formdata.SVC_CD
    param.MDLE_CD = formdata.MDLE_CD
    setSearchParam(param)
    //Grid 초기 처리
    initGrid(dispatch)
    //데이터 조회
    loadData();
  };

  useEffect(() => {
    if(loading){console.log("useLazyQuery is loading...")}else{console.log("useLazyQuery loading completed.")}
    if(error) console.log("useLazyQuery Error", error)
    if (gridData !== undefined) {
      //Context gridData에 조회 결과 저장
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getMenu
      });     
    }
  }, [loading, error, gridData, dispatch]);
  
  return (
    <div >
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(search)}>
            <Box className={media.w490? classes.formBox:null}>
              
              <Grid container spacing={1}>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <ReactHookFormSelect
                    name="SVC_CD"
                    size="small"
                    className={classes.formInputWidth}
                    label="서비스"
                    control={control}
                    onChange={selectChange}
                    defaultValue={searchParam?.SVC_CD || ""}
                    variant="outlined"
                    style={{width : media.w490 ?null:"100%"}}
                    >
                    <MenuItem value={""}>
                        전체
                      </MenuItem>
                    {svcCdLst?.getCode?.map(option => (
                      <MenuItem
                        key={option.COM_CD}
                        value={option.COM_CD}
                      >
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </ReactHookFormSelect>
                </Grid>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <ReactHookFormSelect
                    size="small"
                    variant="outlined"
                    className={classes.formInputWidth}
                    style={{width : media.w490 ?null:"100%"}}
                    control={control}
                    label="모듈"
                    name="MDLE_CD"
                    onChange={selectChange}
                    defaultValue={searchParam?.MDLE_CD}
                  >
                    <MenuItem value={""}>
                        전체
                      </MenuItem>
                    {mdleCdLst?.getCode?.map(option => (
                      <MenuItem
                        key={option.COM_CD}
                        value={option.COM_CD}
                      >
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </ReactHookFormSelect>
                </Grid>
              </Grid>
            </Box>
            <Box >
              <Button
                onClick={() =>
                  dispatch({
                    type: 'READ_ONLY'
                  })
                }
                
                className={media.w490 ?classes.button:classes.w490button}
                type="submit"
                variant="contained"
                color="primary"
              >
                조회
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
    </div>
  );
};

export default MenuSearch;
