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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './AreaNatContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {   disabledHandler,validate } from 'src/components/Utils';
import { AREA_ADD,GET_AREA_DATA,AREA_EDIT } from './AreaNatQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./AreaNatComponent/AreaNatUtils"
import {detailStyle} from "./AreaNatComponent/AreaNatStyle"
import { useGlobalDispatch } from '../AreaGlobalContext';


function AreaNatDetail({ ctnt_cd }) {
  const dispatch = useDataDispatch();
  const globalDispatch = useGlobalDispatch()
  const media = {
    w1691: useMediaQuery('(min-width:1691px)'),
    w1430 : useMediaQuery('(min-width:1430px)'),
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const classes = detailStyle();
  
  const { gridData,areaDetailData, inputReadOnly,  subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues,clearErrors } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 AREA_ADD 뮤테이션 데이터.
  const [selectValue,setSelectValue]=useState()
  const [addMutation] = useMutation(AREA_ADD, { //신규 추가 뮤테이션
    variables: {
      area: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(AREA_EDIT, { //데이터 수정 뮤테이션
    variables: {
      area: postFormData,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(GET_AREA_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    fetchPolicy: 'network-only',
    variables: { param:{AREA_TP_CD:'001'}, ver: 'v1' },
    
  });

  useEffect(() => {
    if (areaDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('AREA_ID', areaDetailData?.AREA_ID);
      setValue('AREA_NM', areaDetailData?.AREA_NM);
      setSelectValue(areaDetailData?.CTNT_CD)
      clearErrors()
    }

  }, [areaDetailData,setValue,setSelectValue,clearErrors]);
 
 
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
      type: 'AREA_DETAIL_RESET',
    });
    
  };

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (areaDetailData?.AREA_ID !== undefined) {
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
    ...data,
    CTNT_CD:selectValue,
    AREA_TP_CD:"001"
    }
    setPostFormData(() =>({ //subMit인풋 데이터 
        ...formData
    }));
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      if(gridData?.map(item=>item.AREA_ID).some(comCd =>comCd === data.AREA_ID)){
        toast.error('중복된 국가ID가 존재합니다.');
      }else{
          try {
            const result = await addMutation();
            console.log(result)
            if(result.data.saveArea.rsltCd === "OK"){
              toast.success('성공적으로 추가 되었습니다.');
              detailSubmitDispatch(reset,dispatch,globalDispatch)
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
    if(editHandler(areaDetailData,formData) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveArea.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(reset,dispatch,globalDispatch)
          dispatch({
            type: 'SEL_FOCUS',
            selFocusId:areaDetailData?.AREA_ID
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
              <h5 className={classes.detailsHeaderTitle}>코드 그룹 정보</h5>

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
              <Grid container spacing={2}  >
                  <Grid item  lg={6}   xs={12}>
                  <TextField
                      error={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? true : false  }
                      helperText={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? '저장소 명를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="국가 ID"
                      fullWidth
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
                      error={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? true : false  }
                      helperText={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? '저장소 명를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="국가 명"
                      fullWidth
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
                  <Grid item lg={12}   xs={12}>
                  <FormControl
                     style={{ width: '100%' }}
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel>대륙 코드</InputLabel>
                      <Select
                        label="대륙 코드"
                        value={selectValue !==undefined ?selectValue:""}
                        onChange={(ev)=>setSelectValue(ev.target.value)}
                      >
                      
                          {ctnt_cd?.getCode?.map(option => (
                              <MenuItem key={option.COM_CD} value={option.COM_CD}>
                                {option.COM_CD_NM}
                              </MenuItem>
                          ))}
                      </Select>
                 </FormControl>
                    
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
AreaNatDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(AreaNatDetail);

