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
  useMediaQuery
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import '../../../../../node_modules/react-toastify/dist/ReactToastify.css';
import { useDataDispatch, useDataState } from './JoinUserContext';
import DetailTable from './JoinUserComponent/DetailTable';
import { EDIT_JOIN_USER, JOIN_USER, PWD_RESET } from './JoinUserQuery';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { disabledHandler, serviceValue, validate } from 'src/components/Utils';
import { confirmAlert } from 'react-confirm-alert';
import {  netError } from 'src/components/netErrorHendle';
import { detailSubmitDispatch, editHandler, param } from './JoinUserComponent/JoinUserUtil';
import Moment from 'moment'
import { detailStyle } from './JoinUserComponent/JoinUserStyle';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function JoinUserDetail({  svcCd, svcUseTpCd }) {
  const classes = detailStyle(); 
  const media = {
    w750 : useMediaQuery('(min-width:750px)'),
    w665 : useMediaQuery('(min-width:665px)'),
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const dispatch = useDataDispatch();
  const { userDetailData, inputReadOnly,subMitFlag } = useDataState();
  const { register, handleSubmit, errors, clearErrors, setValue,getValues } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 ADD_USER 뮤테이션 POST
  const [selectValue, setSelectValue] = useState(); // 유형 선택시 해당 값 상태
  const [MBSHPValue,setMBSHPValue]= useState(null)
  const [PWDValue,setPWDValue]=useState(null)
  const [editMutation, { error: editError }] = useMutation(EDIT_JOIN_USER, {
    variables: {
      user: postFormData,
      ver: 'v1'
    }
  });
  const [resetMutation, { error: pwdError }] = useMutation(PWD_RESET, {
    variables: {
      USR_ID: userDetailData?.USR_ID,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(JOIN_USER, {
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (userDetailData !== undefined) {
      // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('USR_ID', userDetailData?.USR_ID);
      setValue('USR_NM', userDetailData?.USR_NM);
      setValue('NIC_NM', userDetailData?.NIC_NM);
      setValue('HME_SHP_NM', userDetailData?.HME_SHP_NM);
      setValue('HP', userDetailData?.HP);
      setValue('PRM_CRD', userDetailData?.PRM_CRD);
      setValue('EML', userDetailData?.EML);
      setValue('PAID_EXP_DT', userDetailData?.PAID_EXP_DT);
      setValue('NAT_CD', userDetailData?.NAT_CD);
      setValue('LANG_CD', userDetailData?.LANG_CD);
      setValue('GME_CRD', userDetailData?.GME_CRD);
      setValue('LST_LGN_DT', userDetailData?.LST_LGN_DT);
      setValue('USE_SVC_CD_LST', serviceValue(userDetailData?.USE_SVC_CD_LST));
      setMBSHPValue(userDetailData?.MBSHP_EXP_DT);
      setPWDValue(userDetailData?.PWD_EXP_DT)
      setSelectValue(userDetailData?.SVC_USE_TP_CD)
      clearErrors()
    }
    if (editError !== undefined) {
      netError(editError)
    }
    if (pwdError !== undefined) {
      netError(pwdError)
    }
  }, [userDetailData,clearErrors, editError, pwdError, setValue]);



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
  const pwdReset = async () => {
    confirmAlert({
      title: '초기화',
      message: '정말 비밀번호를 초기화 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: async () => {
            try {
              const result = await resetMutation();
              if(result?.data?.resetPwd?.rsltCd ==="OK"){
                toast.success("비밀번호 초기화 하였습니다.")
              }else{
                toast.success("다시 시도해주세요.")
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
        {
          label: '아니요'
        }
      ]
    });
  };

  const onSubmit = async data => {
    Moment.suppressDeprecationWarnings = true;
    let formData={
      USR_ID: data.USR_ID,
      PRM_CRD: Number(data.PRM_CRD),
      MBSHP_EXP_DT: Moment(MBSHPValue).format('YYYY.MM.DD'),
      PWD_EXP_DT: Moment(PWDValue).format('YYYY-MM-DD')
    }
    setPostFormData(() => formData);
    if(editHandler(userDetailData,formData)===false){
      try {
        const result =  await editMutation();
        if(result?.data?.modifyUser?.rsltCd==="OK"){
        toast.success('성공적으로 수정 되었습니다.');
        refetch()
        detailSubmitDispatch(dispatch,userDetailData?.USR_ID)
        
      }
      } catch (error) {
        console.log(error);
      }
    }else{
      toast.error("수정한 내용이 동일합니다.")
    }

       
    }

  return (
    <>
      <Box className={classes.detailBox}>
        <Card>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490?classes.detailHeader:null}>
              <h5 > 가입자 정보 상세</h5>
              {/*  버튼 박스 */}
              <Box className={media.w490?classes.buttonBox:classes.w490buttonBox} >
                <Button
                className={classes.button}
                  style={{ width: '140px' }}
                  onClick={pwdReset}
                  variant="contained"
                  color="primary"
                  disabled={disabledHandler(subMitFlag) ?false:true}
                >
                  비밀번호 초기화
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
            <Box className={media.w750 ? classes.inputBox :classes.w750inputBox} >
              {/* 디테일 인풋폼 그리드 컨테이너 */}
              <Box className={classes.inputGridBox} >
                
                <Grid style={{ width: '100%' }} container spacing={1}>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                      style={{ width:media.w750? '220px':"100%" }}
                      label="아이디 *"
                      variant="outlined"
                      name="USR_ID"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="이름"
                      variant="outlined"
                      name="USR_NM"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="닉네임"
                      variant="outlined"
                      name="NIC_NM"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="홈샵"
                      variant="outlined"
                      name="HME_SHP_NM"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="최근 로그인 시간"
                      variant="outlined"
                      name="LST_LGN_DT"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="HP"
                      variant="outlined"
                      name="HP"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>

                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="EMAIL"
                      variant="outlined"
                      name="EML"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="유료 만료일"
                      variant="outlined"
                      name="PAID_EXP_DT"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <FormControl
                     style={{ width:media.w665 ? media.w750? '220px':"188px" :"100%" }}
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel>회원유형</InputLabel>
                      <Select
                        label="회원유형"
                        value={selectValue !== undefined ? selectValue : ''}
                        onChange={(ev)=>setSelectValue(ev.target.value)}
                        inputProps={{
                          readOnly: true
                        }}
                      >
                        {svcUseTpCd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      label="서비스"
                      variant="outlined"
                      name="USE_SVC_CD_LST"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                    style={{ width:media.w750?'106px':"100%" }}
                      label="국가"
                      variant="outlined"
                      name="NAT_CD"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750?'106px':"100%" }}
                      label="언어"
                      variant="outlined"
                      name="LANG_CD"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                      label="게임 크레딧"
                     style={{ width:media.w750? '220px':"100%" }}
                      variant="outlined"
                      name="GME_CRD"
                      inputRef={register}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                    />
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                    <TextField
                     style={{ width:media.w750? '220px':"100%" }}
                      error={validate(errors?.PRM_CRD,getValues("PRM_CRD")) ? true : false }
                      helperText={ validate(errors?.PRM_CRD,getValues("PRM_CRD")) ? '프로모션크레딧을 입력해주세요.':false}
                      label="프로모션크레딧"
                      focused={inputReadOnly ? true : null}
                      variant="outlined"
                      name="PRM_CRD"
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
                  
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
            
                    <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                      <KeyboardDatePicker
                      style={{  width:media.w750? '220px':"100%" , borderColor: 'red' }}
                      error={postFormData?.MBSHP_EXP_DT === "Invalid date" ?true:false}
                      helperText={postFormData?.MBSHP_EXP_DT==="Invalid date" ?'회원만료일을 선택해주세요.':null}
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="회원만료일"
                        format="yyyy-MM-dd"
                        focused={inputReadOnly ? true : null}
                        onChange={(ev)=>setMBSHPValue(ev)}
                        value={MBSHPValue}
                        name="MBSHP_EXP_DT"
                        size="small"          
                        disabled={inputReadOnly ? false :true }           
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid style={{width:media.w665 ?null :"100%"}} item>
                  <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                      <KeyboardDatePicker
                      error={postFormData?.PWD_EXP_DT === "Invalid date" ?true:false}
                      helperText={postFormData?.PWD_EXP_DT==="Invalid date" ?'비밀번호만료일을 선택해주세요.':null}
                      style={{  width:media.w750? '220px':"100%" , borderColor: 'red' }}
                        autoOk
                        variant="inline"
                        focused={inputReadOnly ? true : null}
                        inputVariant="outlined"
                        label="비밀번호만료일"
                        format="yyyy-MM-dd"
                        onChange={(ev)=>setPWDValue(ev)}
                        value={PWDValue}
                        name="PWD_EXP_DT"
                        size="small"
                        disabled={inputReadOnly ? false :true }  
                
                      />
                    </MuiPickersUtilsProvider>
                  
                  </Grid>
                </Grid>
              </Box>
              <Box width={media.w750 ? '550px':"100%"} marginTop={media.w750 ? 0:"1em"}>
                <DetailTable />
              </Box>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </Box>
          </form>
        </Card>
      </Box>
    
    </>
  );
}
JoinUserDetail.propTypes = {
  className: PropTypes.string
};

export default JoinUserDetail;


