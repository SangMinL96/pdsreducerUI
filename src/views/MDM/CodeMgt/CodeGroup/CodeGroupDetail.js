import React, {   useEffect,    useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  useMediaQuery,
  TextField,
 
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './CodeGroupContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {   disabledHandler,validate } from 'src/components/Utils';
import { CODE_GRP_ADD,GET_CODE_DATA,CODE_GRP_EDIT } from './CodeGroupQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./CodeGroupComponent/CodeGroupUtils"
import {detailStyle} from "./CodeGroupComponent/CodeGroupStyle"


function CodeGroupDetail({ setGrpId }) {
  const dispatch = useDataDispatch();
  const media = {
    w1691: useMediaQuery('(min-width:1691px)'),
    w1430 : useMediaQuery('(min-width:1430px)'),
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const classes = detailStyle();
  const {gridGroupData, codeGrpDetailData, inputReadOnly,  subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues,clearErrors } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 CODE_GRP_ADD 뮤테이션 데이터
  const [addMutation] = useMutation(CODE_GRP_ADD, { //신규 추가 뮤테이션
    variables: {
      codegrp: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(CODE_GRP_EDIT, { //데이터 수정 뮤테이션
    variables: {
      codegrp: postFormData,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(GET_CODE_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    fetchPolicy: 'network-only',
    variables: { COM_CD_GRP_NM:"", ver: 'v1' },
    
  });

  useEffect(() => {
    if (codeGrpDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('COM_CD_GRP_ID', codeGrpDetailData?.COM_CD_GRP_ID);
      setValue('COM_CD_GRP_NM', codeGrpDetailData?.COM_CD_GRP_NM);
      setValue('COM_CD_GRP_DESC', codeGrpDetailData?.COM_CD_GRP_DESC);
      clearErrors()
    
    }
  }, [codeGrpDetailData,setValue,clearErrors]);
 
 
  /**
 * 신규 클릭시 디스패치 이용한 상태 변경 함수
 */
  const inputReset = () => { 
    dispatch({ //인풋 쓰기전용 적용
      type: 'READ_ONLY_FALSE'
    }); 
    dispatch({ // 저장시 신규 submit실행
      type: 'ADD_SUBMET'
    });
    dispatch({ //디테일 인풋값 리셋
      type: 'CODE_GRP_DETAIL_RESET',
    });
    setGrpId(undefined)
  };

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (codeGrpDetailData?.COM_CD_GRP_ID !== undefined) {
      dispatch({ //인풋 쓰기전용 적용
        type: 'READ_ONLY_FALSE'
      }); 
      dispatch({ // 저장시 수정 submit실행
        type: 'EDIT_SUBMET'
      });
    } else {
      toast.error(`수정을 원하는 공지사항을 클릭해주세요.`);  
    }
  };

 /**
 * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시 
 * submit Flag의 따라 실행되는 함수.
 * @param {object} data 인풋 데이터
 */
const onSubmit = async data => {
  let formData= { //subMit인풋 데이터 
 ...data
 }
    setPostFormData(() =>({ //subMit인풋 데이터 
        ...formData
    }));
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      if(gridGroupData?.map(item=>item.COM_CD_GRP_ID).some(id =>id === data.COM_CD_GRP_ID)){
         toast.error("중복된 코드 그룹ID가 존재합니다.")
      }else{
        try {
          const result = await addMutation();
          console.log(result)
          if(result.data.saveCodeGrp.rsltCd === "OK"){
            toast.success('성공적으로 추가 되었습니다.');
            detailSubmitDispatch(reset,dispatch)
          }
          refetch()
          setGrpId(undefined)
        } catch (error) {
          console.log(error);
          dispatch({
            type: 'SUBMET_RESET'
          });
       }
    }
  }
  if (subMitFlag?.editFlag === true) { //수정 subMit 실행 함수
    if(editHandler(codeGrpDetailData,formData) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveCodeGrp.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(reset,dispatch)
          dispatch({
            type: 'SEL_FOCUS',
            selFocusId:codeGrpDetailData?.COM_CD_GRP_ID
          });
          setGrpId(undefined)
        }
        refetch()
      } catch (error) {
        console.log(error);
        dispatch({
          type: 'SUBMET_RESET'
        });
      }
    }else{
      toast.error("수정한 내용이 전과 동일합니다.")
    }
  }
};



  return (
    <>
      <Box>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>코드 그룹 정보</h5>

              {/*  버튼 박스 */}
              <Box className={media.w525 ?classes.detailsBtnBox:classes.w525detailsBtnBox}>
                <Button
                  onClick={inputReset}
                  variant="contained"
                  color="primary"
                  disabled={ subMitFlag?.addFlag ===false ?false:true} 
                >
                  신규
                </Button>
                <Button 
                 style={{marginLeft:media.w525 ? "0.5em":"0.5em"}}
                  onClick={editClick} 
                  variant="contained" 
                  color="primary" 
                  disabled={disabledHandler(subMitFlag) ?false:true}>
                  수정
                </Button>
                <Button
                  style={{marginLeft:media.w525 ? "0.5em":"0.5em", backgroundColor: disabledHandler(subMitFlag) ?"#E0E0E0":"red" }}
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
            <CardContent className={media.w800 ? classes.inputCardContent :classes.w800inputCardContent} >
              {/* 디테일 인풋폼 그리드 컨테이너 */}
              <Grid container spacing={2}  >
                  <Grid item  lg={6}   xs={12}>
                  <TextField
                      error={validate(errors?.COM_CD_GRP_ID,getValues("COM_CD_GRP_ID")) ? true : false  }
                      helperText={validate(errors?.COM_CD_GRP_ID,getValues("COM_CD_GRP_ID")) ? '코드 그룹ID를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="코드 그룹ID"
                      fullWidth
                      variant="outlined"
                      name="COM_CD_GRP_ID"
                      inputRef={register({ required: true })}
                      size="small"
                      InputProps={subMitFlag.addFlag
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                    />
                  </Grid>
                  <Grid item lg={6}   xs={12}>
                  <TextField
                      error={validate(errors?.COM_CD_GRP_NM,getValues("COM_CD_GRP_NM")) ? true : false  }
                      helperText={validate(errors?.COM_CD_GRP_NM,getValues("COM_CD_GRP_NM")) ? '코드 그룹명을 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="코드 그룹명"
                      fullWidth
                      variant="outlined"
                      name="COM_CD_GRP_NM"
                      inputRef={register({ required: true })}
                      size="small"
                      InputProps={inputReadOnly
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                    />
                  </Grid>
                  <Grid item lg={12}   xs={12}>
                  <TextField
                  style={{ width: '100%' }}
                  label="코드 그룹 설명"
                  multiline
                  rows={6}
                  name="COM_CD_GRP_DESC"
                  inputRef={register}
                  variant="outlined"
                  InputProps={inputReadOnly
                    ? { startAdornment: <div></div> }
                    : {
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                />
                    
                  </Grid>
             </Grid>

             
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </CardContent>
          </form>
        </Card>
      </Box>
     
    </>
  );
}
CodeGroupDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(CodeGroupDetail);

