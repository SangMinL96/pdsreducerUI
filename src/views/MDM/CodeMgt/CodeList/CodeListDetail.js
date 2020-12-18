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
import { useDataDispatch, useDataState } from './CodeListContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {   disabledHandler,validate } from 'src/components/Utils';
import { CODE_ADD,GET_CODE_DATA,CODE_EDIT } from './CodeListQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./CodeListComponent/CodeListUtils"
import {detailStyle} from "./CodeListComponent/CodeListStyle"

function CodeListDetail({ grpId}) {
  const classes = detailStyle();
  const dispatch = useDataDispatch();
  const media = {
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const {gridCodeData, codeDetailData, inputReadOnly,  subMitFlag } = useDataState();
  const { register, handleSubmit, errors,  setValue,getValues,clearErrors } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 CODE_ADD 뮤테이션 데이터
  const [addMutation] = useMutation(CODE_ADD, { //신규 추가 뮤테이션
    variables: {
      code: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(CODE_EDIT, { //데이터 수정 뮤테이션
    variables: {
      code: postFormData,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(GET_CODE_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    fetchPolicy: 'network-only',
    variables: { COM_CD_GRP_ID:"", ver: 'v1' },
  });

  useEffect(() => {
    if (codeDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('COM_CD_NM', codeDetailData?.COM_CD_NM);
      setValue('COM_CD_DESC', codeDetailData?.COM_CD_DESC);
      setValue('COM_CD_VAL', codeDetailData?.COM_CD_VAL);
      setValue('COM_CD_SEQ', codeDetailData?.COM_CD_SEQ);
      setValue('UPR_COM_CD', codeDetailData?.UPR_COM_CD);
      clearErrors()
    }
    if(grpId !== undefined){
      setValue('COM_CD', codeDetailData?.COM_CD);
    }else{
      setValue('COM_CD', "");
    }
     
  }, [codeDetailData,setValue,grpId,clearErrors]);
 
 
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
      type: 'CODE_DETAIL_RESET',
    });
  };
 
 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (codeDetailData?.COM_CD !== undefined) {
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
  let formData= { ...data, COM_CD_SEQ:Number(data.COM_CD_SEQ),COM_CD_GRP_ID:grpId}//subMit인풋 데이터 
 
  setPostFormData(() =>({...formData }));//subMit인풋 데이터 
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      if(gridCodeData?.map(item=>item.COM_CD).some(comCd =>comCd === data.COM_CD)){
        toast.error('중복된 코드값이 존재합니다.');
      }else{
        try {
          const result = await addMutation();
          console.log(result)
          if(result.data.saveCode.rsltCd === "OK"){
            toast.success('성공적으로 추가 되었습니다.');
            detailSubmitDispatch(dispatch)
          }
          refetch()
        } catch (error) {
          console.log(error);
          dispatch({
            type: 'SUBMET_RESET'
          });
      }
  }
  }
  if (subMitFlag?.editFlag === true) { //수정 subMit 실행 함수
    if(editHandler(codeDetailData,formData) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveCode.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(dispatch)
          dispatch({
            type: 'SEL_FOCUS',
            selFocusId:codeDetailData?.COM_CD
          });
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
console.log(errors?.COM_CD)


  return (
    <>
      <Box>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>코드 정보</h5>

              {/*  버튼 박스 */}
              <Box className={media.w525 ?classes.detailsBtnBox:classes.w525detailsBtnBox}>
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
                 style={{marginLeft:media.w525 ? "0.5em":"0.5em"}}
                  onClick={editClick} 
                  variant="contained" 
                  color="primary" 
                  disabled={disabledHandler(subMitFlag) ?false:true}>
                  수정
                </Button>
                <Button
                className={classes.button}
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
              <Grid container spacing={2}  className={media.w800 ?classes.detailBox:classes.W800detailBox}>
                  <Grid item  lg={12}   xs={12}>
                  <TextField
                      error={validate(errors?.COM_CD,getValues("COM_CD")) ? true : false  }
                      helperText={validate(errors?.COM_CD,getValues("COM_CD")) ?  '코드를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="코드"
                      variant="outlined"
                      name="COM_CD"
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
                  <Grid item lg={12}   xs={12}>
                      <TextField
                      error={validate(errors?.COM_CD_NM,getValues("COM_CD_NM")) ? true : false  }
                      helperText={validate(errors?.COM_CD_NM,getValues("COM_CD_NM")) ? '코드 명을 입력해주세요.':false}
                          style={{ width: '100%' }}
                          label="코드명"
                          variant="outlined"
                          name="COM_CD_NM"
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
                  <Grid item lg={4}   xs={12}>
                      <TextField
                        
                          style={{ width: '100%' }}
                          label="코드값"
                          variant="outlined"
                          name="COM_CD_VAL"
                          inputRef={register}
                          size="small"
                          InputProps={inputReadOnly
                            ? { startAdornment: <div></div> }//subMitFlag.addFlag
                            : {
                                readOnly: true,
                                startAdornment: <div></div>
                              }}
                        />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                  <TextField
                      style={{ width: '100%' }}
                      label="상위코드"
                      variant="outlined"
                      name="UPR_COM_CD"
                      inputRef={register}
                      size="small"
                      InputProps={inputReadOnly
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                  <TextField
                      style={{ width: '100%' }}
                      label="순서"
                      type="number"
                      variant="outlined"
                      name="COM_CD_SEQ"
                      inputRef={register}
                      size="small"
                      InputProps={inputReadOnly
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                    />
                  </Grid>
                 
             </Grid>

               <Box className={media.w800 ? classes.contentBox:classes.w800contentBox}>
               <TextField
                  style={{ width: '100%' }}
                  label="설명"
                  multiline
                  rows={8}
                  name="COM_CD_DESC"
                  inputRef={register}
                  variant="outlined"
                  InputProps={inputReadOnly
                    ? { startAdornment: <div></div> }
                    : {
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                
                />
              </Box>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </CardContent>
          </form>
        </Card>
      </Box>
     
    </>
  );
}
CodeListDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(CodeListDetail);

