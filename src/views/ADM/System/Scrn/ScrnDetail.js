import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { ADD_SCRN, GET_SCRN, EDI_SCRN, GET_API, SAVE_SCRN_API, GET_SCREEN_API } from './ScrnQuery';
import {   useMutation, useQuery } from '@apollo/react-hooks';
import {  toast } from 'react-toastify';
import '../../../../../node_modules/react-toastify/dist/ReactToastify.css';
import { useDataDispatch, useDataState } from './ScrnContext';
import {  netError } from 'src/components/netErrorHendle';
import { detailSubmitDispatch, editHandler,param } from './ScrnComponent/ScrnUtil';
import { dataAddHandler,dataEditHandler, validate,disabledHandler } from 'src/components/Utils';
import { detailStyle } from './ScrnComponent/ScrnStyle';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

var paramApi = {}
var paramScreenApi = {}
var apiGridCtrl = null
function ScrnDetail({ className, svcCd, ...rest }) {
  const media = {
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const classes = detailStyle();
  const dispatch = useDataDispatch();
  const { scrnDetailData, inputReadOnly, subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues,clearErrors } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 ADD_SCRN 뮤테이션 POST
  const [selectValue, setSelectValue] = useState(); // 유형 선택시 해당 값 상태
  const {refetch } = useQuery(GET_SCRN, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: { param, ver: 'v1' }
  });

  const {data: gridApiData, refetch: fetchApi } = useQuery(GET_API, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip:(paramApi.SCRN_ID===undefined || paramApi.SCRN_ID===''),
    variables: { scrnId:paramApi.SCRN_ID, ver: 'v1' }
  });
  const {data: gridScreenApiData, refetch: fetchScreenApi } = useQuery(GET_SCREEN_API, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip:(paramApi.SCRN_ID===undefined || paramApi.SCRN_ID===''),
    variables: { scrnId:paramApi.SCRN_ID, ver: 'v1' }
  });

  const [addMutation, { error: addError }] = useMutation(ADD_SCRN, {
    variables: {
      screen: postFormData,
      ver: 'v1'
    }
  });
  const [addApiMutation,] = useMutation(SAVE_SCRN_API, {
    variables: {
      skip:(paramScreenApi.SCRN_ID===undefined || paramScreenApi.SCRN_ID===''),
      screenapi: paramScreenApi,
      ver: 'v1'
    }
  });
  const [editMutation, { error: editError }] = useMutation(EDI_SCRN, {
    variables: {
      screen: postFormData,
      ver: 'v1'
    }
  });

  function onGridReady(params) {
    apiGridCtrl = params.api;
  }

  const checkScreenApis = (screenApis) => {
    console.log(screenApis)
    apiGridCtrl.forEachNode(node => {
      const arr=screenApis.map( 
        api => api.API_ID === node.data.API_ID?true:false
      )
      node.setSelected(arr.includes(true))
    })
  }

  useEffect(() => {
    if (scrnDetailData?.SCRN_ID ) {
      // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('SCRN_ID', scrnDetailData?.SCRN_ID);
      setValue('SCRN_NM', scrnDetailData?.SCRN_NM);
      setValue('SCRN_DESC', scrnDetailData?.SCRN_DESC);
      setValue('SCRN_LNK_PTH', scrnDetailData?.SCRN_LNK_PTH);
      setSelectValue(scrnDetailData?.SVC_CD);
      if(gridScreenApiData?.getScreenApi) {
        checkScreenApis(gridScreenApiData.getScreenApi)
      }
      if(paramApi.SCRN_ID !== scrnDetailData?.SCRN_ID) {
        paramApi.SCRN_ID = scrnDetailData?.SCRN_ID
        fetchApi();
        fetchScreenApi();
      }
      clearErrors()
    } 
    if (addError !== undefined) {
      netError(addError)
    }
    if (editError !== undefined) {
      netError(editError)
    }
    
  }, [scrnDetailData,subMitFlag,addError, editError, svcCd, setValue, clearErrors,gridApiData, fetchApi, gridScreenApiData, fetchScreenApi]);


  const inputReset = () => {
    dispatch({
      type: 'READ_ONLY_FALSE'
    }); //인풋 쓰기전용 적용
    dispatch({
      type: 'ADD_SUBMET'
    });
    dispatch({
      type: 'SCRN_DETAIL_RESET'
    });
    reset(); // 인풋 Value 초기화(React-hook-form 기능)
  };
  const editClick = () => {
    if (scrnDetailData?.SCRN_ID !== undefined) {
      dispatch({
        type: 'READ_ONLY_FALSE'
      }); //인풋 쓰기전용 적용
      dispatch({
        type: 'EDIT_SUBMET'
      });
    } else {
      toast.error(`수정을 원하는 유저를 클릭해주세요.`);
    }
  };

  const onSubmit = async data => {
    let formData ={ ...data,
      SVC_CD:selectValue}
    setPostFormData(()=>formData);
    if (subMitFlag?.addFlag === true) {
      try {
        const data = await addMutation();
        const result = data?.data?.saveScreen?.rsltCd
        paramScreenApi.SCRN_ID = paramApi.SCRN_ID
        paramScreenApi.API_IDS = gridApiData?.getScreenApi.map(item => item.API_ID)
        const apiData = await addApiMutation();
        const apiResult = apiData?.data?.saveScreenApi?.rsltCd
        dataAddHandler(apiResult,toast,refetch,result)
        detailSubmitDispatch(dispatch)
        reset();
      } catch (error) {
        console.log(error);
      }
    }
    if (subMitFlag?.editFlag === true) {
     if(editHandler(scrnDetailData,formData)===false){
        try {
          const datas= await editMutation();
          const result = datas?.data?.saveScreen?.rsltCd
          const selectedApis = apiGridCtrl.getSelectedRows()
          paramScreenApi.SCRN_ID = paramApi.SCRN_ID
          paramScreenApi.API_IDS = selectedApis.map(data => data.API_ID)
          debugger
          const apiData = await addApiMutation()
          const apiResult = apiData?.data?.saveScreenApi?.rsltCd
          dataEditHandler(apiResult,toast,refetch,dispatch,scrnDetailData?.SCRN_ID,result)
          fetchApi()
          fetchScreenApi()
          detailSubmitDispatch(dispatch)
        } catch (error) {
          toast.error("다시시도 해주세요.")
          console.log(error);
        }
      }else{
        toast.error("수정한 내용이 동일합니다.")
      }

     
    }
    
  };
  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
    width: 200
  };
  const ApiColumns = [
    {
      headerName: 'ID',
      field: 'API_ID',
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      headerName: 'API 명',
      field: 'API_NM'
    },
    {
      headerName: '버전',
      field: 'API_VER'
    },
    {
      headerName: '모듈',
      field: 'MDLE_CD'
    },
    {
      headerName: 'ENDPOINT',
      field: 'API_EPT_PTH'
    },
    {
      headerName: '기능',
      field: 'FUNC_CD'
    }
  ];
  return (
    <div {...rest}>
      <Box>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490 ?classes.detailBar:classes.w490detailBar}>
              <h5 >
                화면 정보 상세
              </h5>
              {/*  버튼 박스 */}
              <Box className={media.w490?classes.detailBtnBox:classes.w490detailBtnBox}>
                <Button
                  className={classes.button}
                  onClick={inputReset}
                  variant="contained"
                  color="primary"
                    disabled={ subMitFlag?.addFlag ===false ?false:true}
                >
                  신규
                </Button>
                <Button
                  className={classes.button}
                  onClick={editClick}
                  variant="contained"
                  color="primary"
                  disabled={disabledHandler(subMitFlag) ?false:true}
                >
                  수정
                </Button>
                <Button
                  className={classes.button}
                  style={{ backgroundColor: disabledHandler(subMitFlag) ?"#E0E0E0":"red" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={ disabledHandler(subMitFlag) ?true:false}
                >
                  저장
                </Button>
              </Box>
              {/*  버튼 박스 */}
            </Box>
            <Box className={classes.inputBox}  >
              {/* 디테일 인풋폼 그리드 컨테이너 */}
              <Box className={classes.inputBox} >
                <Grid style={{ width: '100%' }} container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      error={validate(errors?.SCRN_ID,getValues("SCRN_ID")) ? true : false }
                      helperText={ validate(errors?.SCRN_ID,getValues("SCRN_ID")) ? '아이디를 입력해 주세요.':false}
                      style={{ width: '100%' }}
                      label="아이디 *"
                      variant="outlined"
                      name="SCRN_ID"
                      inputRef={register({ required: true })}
                      size="small"
                      InputProps={
                        inputReadOnly
                          ? { startAdornment: <div></div> }
                          : {
                              readOnly: true,
                              startAdornment: <div></div>
                            }
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={validate(errors?.SCRN_NM,getValues("SCRN_NM")) ? true : false }
                      helperText={ validate(errors?.SCRN_NM,getValues("SCRN_NM")) ? '이름를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="이름 *"
                      variant="outlined"
                      name="SCRN_NM"
                      inputRef={register({ required: true })}
                      size="small"
                      InputProps={
                        inputReadOnly
                          ? { startAdornment: <div></div> }
                          : {
                              readOnly: true,
                              startAdornment: <div></div>
                            }
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      size="small"
                      variant="outlined"
                      style={{ width: '100%' }}
                    >
                      <InputLabel>서비스</InputLabel>
                      <Select
                        label="서비스"
                        value={selectValue !== undefined ? selectValue : ''}
                        onChange={ (ev)=>setSelectValue(ev.target.value)}
                        readOnly={inputReadOnly ? false :true}                 
                      >
                        {svcCd?.getCode?.map(option => (
                          <MenuItem
                            key={option.COM_CD}
                            value={ option.COM_CD }
                          >
                          {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      style={{ width: '100%' }}
                      label="링크 경로 *"
                      variant="outlined"
                      name="SCRN_LNK_PTH"
                      inputRef={register({ required: true })}
                      size="small"
                      InputProps={
                        inputReadOnly
                          ? { startAdornment: <div></div> }
                          : {
                              readOnly: true,
                              startAdornment: <div></div>
                            }
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="설명"
                      variant="outlined"
                      name="SCRN_DESC"
                      inputRef={register({ required: false })}
                      size="small"
                      InputProps={
                        inputReadOnly
                          ? { startAdornment: <div></div> }
                          : {
                              readOnly: true,
                              startAdornment: <div></div>
                            }
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="ag-theme-alpine" style={{ position: 'relative', height: '500px', width: '100%' }}>
                      <AgGridReact
                      headerHeight={35}
                      onGridReady={onGridReady}
                      rowSelection="multiple"
                      rowData={gridApiData?.getApi}
                      defaultColDef={defaultColDef}
                      localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                      columnDefs={ApiColumns}
                      // onRowClicked={onRowClickd}
                      // onRowSelected={onRowSelected}
                      gridOptions={{ rowHeight: 38 }}
                     
                      />
                    </Box>
                 </Grid>
                </Grid>
              </Box>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </Box >
          </form>
        </Card>
      </Box>
      
    </div>
  );
}
ScrnDetail.propTypes = {
  className: PropTypes.string
};

export default ScrnDetail;


//
