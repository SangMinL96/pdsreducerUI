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
import { ADD_USER, ADMIN_USER, EDI_USER } from './AdminUserQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {  toast } from 'react-toastify';
import '../../../../../node_modules/react-toastify/dist/ReactToastify.css';
import { useDataDispatch, useDataState } from './AdminUserContext';
import {  netError } from 'src/components/netErrorHendle';
import { detailSubmitDispatch, editHandler,  param } from './AdminUserComponent/AdminUserUtil';
import { dataAddHandler,dataEditHandler, validate,disabledHandler } from 'src/components/Utils';
import { detailStyle } from './AdminUserComponent/AdminUserStyle';

function AdminUserDetail({ className, userType, ...rest }) {
  const media = {
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const classes = detailStyle();
  const dispatch = useDataDispatch();
  const { userDetailData, inputReadOnly, subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues,clearErrors} = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 ADD_USER 뮤테이션 POST
  const [selectValue, setSelectValue] = useState(); // 유형 선택시 해당 값 상태
  const [refetch ] = useLazyQuery(ADMIN_USER, {
    fetchPolicy: 'network-only',
    variables: { param, ver: 'v1' }
  });
  const [addMutation, { error: addError }] = useMutation(ADD_USER, {
    variables: {
      user: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation, { error: editError }] = useMutation(EDI_USER, {
    variables: {
      user: postFormData,
      ver: 'v1'
    }
  });

  useEffect(() => {
    if (userDetailData !==undefined ) {
      // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('USR_ID', userDetailData?.USR_ID);
      setValue('USR_NM', userDetailData?.USR_NM);
      setValue('BLN_NM', userDetailData?.BLN_NM);
      setValue('HP', userDetailData?.HP);
      setValue('EML', userDetailData?.EML);
      setSelectValue(userDetailData?.USR_TP_CD);
      clearErrors()
    }
    if (addError !== undefined) {
      netError(addError)
    }
    if (editError !== undefined) {
      netError(editError)
    }
    
  }, [userDetailData,subMitFlag,addError,clearErrors, editError, userType, setValue]);


  const inputReset = () => {
    dispatch({
      type: 'READ_ONLY_FALSE'
    }); //인풋 쓰기전용 적용
    dispatch({
      type: 'ADD_SUBMET'
    });
    dispatch({
      type: 'USER_DETAIL_RESET'
    });
    reset(); // 인풋 Value 초기화(React-hook-form 기능)
  };
  const editClick = () => {
    if (userDetailData?.USR_ID !== undefined) {
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
      USR_TP_CD:selectValue}
    setPostFormData(()=>formData);
  
    if (subMitFlag?.addFlag === true) {
      try {
       const data = await addMutation();
       const result = data?.data?.addUser?.rsltCd
       dataAddHandler(result,toast,refetch)
       detailSubmitDispatch(dispatch)
        reset();
      } catch (error) {
        console.log(error);
      }
    }
    if (subMitFlag?.editFlag === true) {
     if(editHandler(userDetailData,formData)===false){
        try {
          const datas= await editMutation();
          const result = datas?.data?.modifyUser?.rsltCd
          dataEditHandler(result,toast,refetch)
          detailSubmitDispatch(dispatch)
          dispatch({
            type:'SEL_FOCUS',
            selFocusId:userDetailData?.USR_ID
          });
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
                <Grid item xs={4}>
                  <TextField
                    error={validate(errors?.USR_ID,getValues("USR_ID")) ? true : false }
                    helperText={ validate(errors?.USR_ID,getValues("USR_ID")) ? '아이디를 입력해주세요.':false}
                    style={{ width: '100%' }}
                    label="아이디 *"
                    variant="outlined"
                    name="USR_ID"
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
                <Grid item xs={4}>
                  <TextField
                   error={validate(errors?.USR_NM,getValues("USR_NM")) ? true : false }
                   helperText={ validate(errors?.USR_NM,getValues("USR_NM")) ? '이름를 입력해주세요.':false}
                    style={{ width: '100%' }}
                    label="이름 *"
                    variant="outlined"
                    name="USR_NM"
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
                <Grid item xs={4}>
                  <TextField
                   error={validate(errors?.BLN_NM,getValues("BLN_NM")) ? true : false }
                   helperText={ validate(errors?.BLN_NM,getValues("BLN_NM")) ? '소속을 입력해주세요.':false}
                    style={{ width: '100%' }}
                    label="소속 *"
                    variant="outlined"
                    name="BLN_NM"
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
                <Grid item xs={4}>
                  <FormControl
                    size="small"
                    variant="outlined"
                    style={{ width: '100%' }}
                  >
                    <InputLabel>유형</InputLabel>
                    <Select
                      label="유형"
                      value={selectValue !== undefined ? selectValue : ''}
                      onChange={ (ev)=>setSelectValue(ev.target.value)}
                      readOnly={inputReadOnly ? false :true}
                  
                    >
                      {userType?.getCode?.map(option => (
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

                <Grid item xs={4}>
                  <TextField
                    error={validate(errors?.HP,getValues("HP")) ? true : false }
                    helperText={ validate(errors?.HP,getValues("HP")) ? '번호를 다시 입력해주세요.':false}                 
                    style={{ width: '100%' }}
                    label="HP"
                    type="number"
                    variant="outlined"
                    name="HP"
                    inputRef={register({ required: true, minLength: 11 })}
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
                <Grid item xs={4}>
                  <Box display="EMAIL">
                    <TextField
                      error={validate(errors?.EML,getValues("EML")) ? true : false }
                      helperText={ validate(errors?.EML,getValues("EML")) ? '이메일을 다시 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="이메일"
                      variant="outlined"
                      name="EML"
                      inputRef={register({
                        required: true,
                        pattern: /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
                      })}
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
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="운영팀-총괄관리자,내셔널딜러,서브딜러,OP등"
                    variant="outlined"
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
AdminUserDetail.propTypes = {
  className: PropTypes.string
};

export default AdminUserDetail;


//
