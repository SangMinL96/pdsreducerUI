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
import { ADD_API, GET_API, EDI_API } from './ApiQuery';
import {  useLazyQuery, useMutation,  } from '@apollo/react-hooks';
import {  toast } from 'react-toastify';
import '../../../../../node_modules/react-toastify/dist/ReactToastify.css';
import { useDataDispatch, useDataState } from './ApiContext';
import {  netError } from 'src/components/netErrorHendle';
import { detailSubmitDispatch, editHandler,  param } from './ApiComponent/ApiUtil';
import { dataAddHandler,dataEditHandler, validate,disabledHandler } from 'src/components/Utils';
import { detailStyle } from './ApiComponent/ApiStyle';

function ApiDetail({ className, mdleType, ...rest }) {
  const media = {
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const classes = detailStyle();
  const dispatch = useDataDispatch();
  const { apiDetailData, inputReadOnly, subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues,clearErrors } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 ADD_API 뮤테이션 POST
  const [selectValue, setSelectValue] = useState(); // 유형 선택시 해당 값 상태
  const [refetch ] = useLazyQuery(GET_API, {
        fetchPolicy: 'network-only',
        variables: { param, ver: 'v1' }
  });

  const [addMutation, { error: addError }] = useMutation(ADD_API, {
    variables: {
      api: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation, { error: editError }] = useMutation(EDI_API, {
    variables: {
      api: postFormData,
      ver: 'v1'
    }
  });

  useEffect(() => {
    if (apiDetailData !==undefined ) {
      // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('API_ID', apiDetailData?.API_ID);
      setValue('API_NM', apiDetailData?.API_NM);
      setValue('API_DESC', apiDetailData?.API_DESC);
      setValue('API_VER', apiDetailData?.API_VER);
      setValue('API_EPT_PTH', apiDetailData?.API_EPT_PTH);
      setValue('FUNC_CD', apiDetailData?.FUNC_CD);
      setSelectValue(apiDetailData?.MDLE_CD);
      clearErrors()
    }
    if (addError !== undefined) {
      netError(addError)
    }
    if (editError !== undefined) {
      netError(editError)
    }
    
  }, [apiDetailData,subMitFlag,addError,clearErrors, editError, mdleType, setValue]);


  const inputReset = () => {
    dispatch({
      type: 'READ_ONLY_FALSE'
    }); //인풋 쓰기전용 적용
    dispatch({
      type: 'ADD_SUBMET'
    });
    dispatch({
      type: 'API_DETAIL_RESET'
    });
    reset(); // 인풋 Value 초기화(React-hook-form 기능)
  };
  const editClick = () => {
    if (apiDetailData?.API_ID !== undefined) {
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
    console.log(data)
    let formData ={ ...data,
      MDLE_CD:selectValue}
    setPostFormData(()=>formData);
    if (subMitFlag?.addFlag === true) {
      try {
       const data = await addMutation();
       const result = data?.data?.saveApi?.rsltCd
       console.log(data)
       dataAddHandler(result,toast,refetch)
       detailSubmitDispatch(dispatch)
        reset();
      } catch (error) {
        console.log(error);
      }
    }
    if (subMitFlag?.editFlag === true) {
     if(editHandler(apiDetailData,formData)===false){
        try {
          const datas= await editMutation();
          const result = datas?.data?.saveApi?.rsltCd
          dataEditHandler(result,toast,refetch)
          dispatch({
            type:'SEL_FOCUS',
            selFocusId:apiDetailData?.API_ID
          });
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

  return (
    <div {...rest}>
      <Box>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490 ?classes.detailBar:classes.w490detailBar}>
              <h5 >
                운영자 정보 상세
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
              <Grid style={{ width: '100%' }} container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    error={validate(errors?.API_ID,getValues("API_ID")) ? true : false }
                    helperText={ validate(errors?.API_ID,getValues("API_ID")) ? '아이디를 입력해 주세요.':false}
                    style={{ width: '100%' }}
                    label="아이디 *"
                    variant="outlined"
                    name="API_ID"
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
                <Grid item xs={3}>
                  <TextField
                    error={validate(errors?.API_NM,getValues("API_NM")) ? true : false }
                    helperText={ validate(errors?.API_NM,getValues("API_NM")) ? '이름를 입력해주세요.':false}
                    style={{ width: '100%' }}
                    label="이름 *"
                    variant="outlined"
                    name="API_NM"
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
                <Grid item xs={3}>
                  <FormControl
                    size="small"
                    variant="outlined"
                    style={{ width: '100%' }}
                  >
                    <InputLabel>모듈</InputLabel>
                    <Select
                      label="모듈"
                      value={selectValue !== undefined ? selectValue : ''}
                      onChange={ (ev)=>setSelectValue(ev.target.value)}
                      readOnly={inputReadOnly ? false :true}                 
                    >
                      {mdleType?.getCode?.map(option => (
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

                <Grid item xs={3}>
                <TextField
                    style={{ width: '100%' }}
                    label="버전 *"
                    variant="outlined"
                    name="API_VER"
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
                    style={{ width: '100%' }}
                    label="END POINT *"
                    variant="outlined"
                    name="API_EPT_PTH"
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
                    error={errors?.FUNC_CD ? true : false }
                    helperText={ errors?.FUNC_CD ? 'C, R, U, D 중 하나를 입력하세요.':false}
                    style={{ width: '100%' }}
                    label="기능(C, R, U, D) *"
                    variant="outlined"
                    name="FUNC_CD"
                    inputRef={register({ required: true,
                      pattern: /[CRUD]{1}/,
                      maxLength : 1
                    })}
                    size="small"
                    InputProps={
                      inputReadOnly
                        ? { startAdornment: <div></div>,
                        }
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
                    name="API_DESC"
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
              </Grid>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </Box >
          </form>
        </Card>
      </Box>
      
    </div>
  );
}
ApiDetail.propTypes = {
  className: PropTypes.string
};

export default ApiDetail;


//
