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
  InputLabel
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import MultiSelects from 'react-multi-select-component';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './MachineSWContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {   disabledHandler,validate, serviceValue } from 'src/components/Utils'
import { SVN_ADD,MCN_SW_DATA,SVN_EDIT } from './MachineSWQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./MachineSWComponent/MachineSWUtils"
import {detailStyle} from "./MachineSWComponent/MachineSWStyle"
import styled from 'styled-components';


function MachineSWDetail({ svc_code,sw_tp_code }) {
  const dispatch = useDataDispatch();
  const media = {

    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const classes = detailStyle();
  const { svnDetailData, inputReadOnly,  subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues ,clearErrors} = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 SVN_ADD 뮤테이션 데이터
  const [selected, setSelected] = useState([]); //공지대상 서비스 유형 인풋값
  const [selectValue,setSelectValue]=useState()
  const [addMutation] = useMutation(SVN_ADD, { //신규 추가 뮤테이션
    variables: {
      mcnswrepo: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(SVN_EDIT, { //데이터 수정 뮤테이션
    variables: {
      mcnswrepo: postFormData,
      ver: 'v1'
    }
  });
  const  [refetch] = useLazyQuery(MCN_SW_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    variables: { SVC_CD:"", ver: 'v1' },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (svnDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('SVN_ID', svnDetailData?.SVN_ID);
      setValue('SVN_PWD', svnDetailData?.SVN_PWD);
      setValue('SW_DESC', svnDetailData?.SW_DESC);
      setValue('MCN_SW_REPO_NM', svnDetailData?.MCN_SW_REPO_NM);
      setValue('SVN_PTH', svnDetailData?.SVN_PTH);
      setSelectValue(svnDetailData?.SW_TP_CD);
      setSelected(
        svnDetailData?.SVC_CD?.split(',').map(item => ({
          label: serviceValue(item),
          value: item
        }))||[]
      );
      clearErrors()
    }
    
  }, [svnDetailData,clearErrors,setValue,setSelectValue,setSelected]);
 
 
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
      type: 'SVN_DETAIL_RESET',
    });
  };
 
 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (svnDetailData?.SVN_ID !== undefined) {
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
    SVC_CD:selected?.map(item=>item.value).toString(),
    SW_TP_CD:selectValue,
    MCN_SW_REPO_ID:subMitFlag?.editFlag === true ? svnDetailData?.MCN_SW_REPO_ID : undefined
 }
      setPostFormData(() =>({ //subMit인풋 데이터 
        ...formData
    }));
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      try {
        const result = await addMutation();
        console.log(result)
        if(result.data.saveMcnSwRepo.rsltCd === "OK"){
          toast.success('성공적으로 추가 되었습니다.');
          detailSubmitDispatch(reset,dispatch)
        }
        refetch()
      } catch (error) {
        console.log(error);
        dispatch({
          type: 'SUBMET_RESET'
        });
    }
  }
  if (subMitFlag?.editFlag === true) { //수정 subMit 실행 함수
    if(editHandler(svnDetailData,formData) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveMcnSwRepo.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(reset,dispatch,svnDetailData?.MCN_SW_REPO_ID)
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
              <h5 className={classes.detailsHeaderTitle}>머신 SW 저장소</h5>

              {/*  버튼 박스 */}
              <Box className={media.w525 ?classes.detailsBtnBox:classes.w525detailsBtnBox}>
                <Button
                className={classes.detailBtn}
                  onClick={inputReset}
                  variant="contained"
                  color="primary"
                  disabled={ subMitFlag?.addFlag ===false ?false:true} 
                >
                  신규
                </Button>
                <Button 
                 className={classes.detailBtn}
                 style={{marginLeft:media.w525 ? "0.5em":"0.5em"}}
                  onClick={editClick} 
                  variant="contained" 
                  color="primary" 
                  disabled={disabledHandler(subMitFlag) ?false:true}>
                  수정
                </Button>
                <Button
                 className={classes.detailBtn}
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
                  <Grid item  lg={6}   xs={12}>
                    <MultiSelect
                        options={
                          inputReadOnly ?  svc_code !== undefined
                            ?  svc_code?.getCode.map(item => ({
                                label: item.COM_CD_NM,
                                value: item.COM_CD
                              }))
                            : [] :[]
                        }
                        value={selected !==undefined?selected :""}
                        onChange={setSelected}
                        hasSelectAll={false}
                        disableSearch={true}
                        overrideStrings={{
                          selectSomeItems: (
                            <span style={{ color: '#546E7A' }}>서비스</span>
                          ),
                          allItemsAreSelected: svc_code?.getCode.map(
                            item => `${item.COM_CD_NM}, `
                          )
                        }}
                      />
                  </Grid>
                  <Grid item lg={6}   xs={12}>
                  <FormControl
                  style={{width:"100%"}}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel>SW구분</InputLabel>
                  <Select
                    label="SW구분"
                    value={selectValue !==undefined ?selectValue:"" }
                    onChange={(ev)=>setSelectValue(ev.target.value)}
                    readOnly={inputReadOnly ? false: true}
                  > 
                    {sw_tp_code?.getCode?.map(option => (
                      <MenuItem key={option.COM_CD} value={option.COM_CD}>
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                  </Grid>
                  <Grid item lg={12}   xs={12}>
                  <TextField
                      error={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? true : false  }
                      helperText={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? '저장소 명를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="저장소 명 "
                      fullWidth
                      variant="outlined"
                      name="MCN_SW_REPO_NM"
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
                  <Grid item lg={12} xs={12}>
                  <TextField
                        error={validate(errors?.SVN_PTH,getValues("SVN_PTH")) ? true : false  }
                      helperText={validate(errors?.SVN_PTH,getValues("SVN_PTH")) ? 'SVN 경로를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="SVN 경로"
                      fullWidth
                      variant="outlined"
                      name="SVN_PTH"
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
                  <Grid item lg={6}   xs={12}>
                  <TextField
                     error={validate(errors?.SVN_ID,getValues("SVN_ID")) ? true : false  }
                      helperText={validate(errors?.SVN_ID,getValues("SVN_ID")) ? '아이디를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="아이디 "
                      fullWidth
                      variant="outlined"
                      name="SVN_ID"
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
                  <Grid item lg={6}   xs={12}>
                  <TextField
                      error={validate(errors?.SVN_PWD,getValues("SVN_PWD")) ? true : false  }
                      helperText={validate(errors?.SVN_PWD,getValues("SVN_PWD")) ? '비밀번호를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="비밀번호 "
                      fullWidth
                      variant="outlined"
                      name="SVN_PWD"
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

               <Box className={media.w800 ? classes.contentBox:classes.w800contentBox}>
               <TextField
                  error={validate(errors?.SW_DESC,getValues("SW_DESC")) ? true : false  }
                 helperText={validate(errors?.SW_DESC,getValues("SW_DESC")) ? '설명를 입력해주세요.':false}
                  style={{ width: '100%' }}
                  label="설명"
                  multiline
                  rows={10}
                  name="SW_DESC"
                  inputRef={register({ required: true })}
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
MachineSWDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(MachineSWDetail);

const MultiSelect = styled(MultiSelects)`
    z-index: 99;
    position:relative;
    font-size:14px;
    width: 100%;
    .dropdown-container{
  --rmsc-main: #4285f4;
  --rmsc-hover: #f1f3f5;
  --rmsc-selected: #e2e6ea;
  --rmsc-border: #ccc;
  --rmsc-gray: #aaa;
  --rmsc-bg: #fff;
  --rmsc-p: 10px; /* Spacing */
  --rmsc-radius: 4px; /* Radius */
  --rmsc-h: 34px; /* Height */
}
    
    
`;