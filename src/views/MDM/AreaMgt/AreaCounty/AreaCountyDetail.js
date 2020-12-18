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
import { useDataDispatch, useDataState } from './AreaCountyContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {   disabledHandler,validate } from 'src/components/Utils';
import { COUNTY_ADD,GET_COUNTY_DATA,COUNTY_EDIT } from './AreaCountyQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./AreaCountyComponent/AreaCountyUtils"
import {detailStyle} from "./AreaCountyComponent/AreaCountyStyle"
import { useGlobalDispatch, useGlobalState } from '../AreaGlobalContext';

function AreaCountyDetail() {
  const classes = detailStyle();
  const dispatch = useDataDispatch();
  const globalDispatch = useGlobalDispatch()
  const {county_urp_id,countyReset} =useGlobalState()
  const media = {
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const {gridData, countyDetailData, inputReadOnly,  subMitFlag } = useDataState();
  const { register, handleSubmit, errors,  setValue,getValues,clearErrors} = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 CODE_ADD 뮤테이션 데이터
  const [addMutation] = useMutation(COUNTY_ADD, { //신규 추가 뮤테이션
    variables: {
      area: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(COUNTY_EDIT, { //데이터 수정 뮤테이션
    variables: {
      area: postFormData,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(GET_COUNTY_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    fetchPolicy: 'network-only',
    variables: { param: { AREA_TP_CD: '003',UPR_AREA_ID: county_urp_id},ver: 'v1'}
  });

  useEffect(() => {
    if (countyDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('AREA_ID', countyDetailData?.AREA_ID);
      setValue('AREA_NM', countyDetailData?.AREA_NM);
      clearErrors()
    }
    if(countyReset ===true){
      dispatch({ //디테일 인풋값 리셋
        type: 'COUNTY_DETAIL_RESET',
      });
      globalDispatch({
        type: "COUNTY_RESET",
        boolean:false
      })
    }
  }, [countyDetailData,globalDispatch,setValue,dispatch,countyReset,clearErrors,county_urp_id]);
 
 
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
      type: 'COUNTY_DETAIL_RESET',
    });
  };
 
 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (countyDetailData?.AREA_ID !== undefined) {
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

  let formData= { ...data,AREA_TP_CD:"003",UPR_AREA_ID:county_urp_id}//subMit인풋 데이터 
  setPostFormData(() =>({...formData }));//subMit인풋 데이터 
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      if(gridData?.map(item=>item.AREA_ID).some(comCd =>comCd === data.AREA_ID)){
        toast.error('중복된 코드값이 존재합니다.');
      }else{
        try {
          const result = await addMutation();
          console.log(result)
          if(result.data.saveArea.rsltCd === "OK"){
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
    if(editHandler(countyDetailData,formData,county_urp_id) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveArea.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(dispatch)
          dispatch({
            type: 'SEL_FOCUS',
            selFocusId:countyDetailData?.AREA_ID
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
              <Grid container spacing={2} >
                  <Grid item  lg={6}   xs={12}>
                  <TextField
                      error={validate(errors?.AREA_ID,getValues("AREA_ID")) ? true : false  }
                      helperText={validate(errors?.AREA_ID,getValues("AREA_ID")) ?  '코드를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="시군구 ID"
                      variant="outlined"
                      name="AREA_ID"
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
                          error={validate(errors?.AREA_ID,getValues("AREA_ID")) ? true : false  }
                          helperText={validate(errors?.AREA_ID,getValues("AREA_ID")) ? '코드 값을 입력해주세요.':false}
                          style={{ width: '100%' }}
                          label="시군구명"
                          variant="outlined"
                          name="AREA_NM"
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

             </Grid>

               
             
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </CardContent>
          </form>
        </Card>
      </Box>
     
    </>
  );
}
AreaCountyDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(AreaCountyDetail);

