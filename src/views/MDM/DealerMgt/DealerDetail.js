import React, {   useEffect,    useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  useMediaQuery,
  InputLabel,
  FormControl
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './DealerContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  disabledHandler } from 'src/components/Utils';
import { DEALER_ADD,GET_DEALER_DATA,DEALER_EDIT } from './DealerQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler} from "./DealerComponent/DealerUtils"
import {detailStyle} from "./DealerComponent/DealerStyle"

function DealerDetail({dlr_tp_cd,areacode,setCityUrpId,setCountyUrpId,getUser,cityCode,countyCode}) {
  const dispatch = useDataDispatch();
  const media = {
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const classes = detailStyle();
  const { gridData,dlrDetailData, inputReadOnly ,subMitFlag } = useDataState();
  const { register, handleSubmit,  reset, setValue,clearErrors  } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 DEALER_ADD 뮤테이션 데이터
  const [selectValue,setSelectValue] = useState({
    DLR_ID:"",
    DLR_TP_CD:"",
    NAT_ID:"",
    STE_ID:"",
    CTY_ID:"",
})
  const [addMutation] = useMutation(DEALER_ADD, { //신규 추가 뮤테이션
    variables: {
      dealer: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(DEALER_EDIT, { //데이터 수정 뮤테이션
    variables: {
      dealer: postFormData,
      ver: 'v1'
    }
  });
  const [refetch ] = useLazyQuery(GET_DEALER_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    fetchPolicy: 'network-only',
    variables: {
      param: {NAT_ID:"",STE_ID:""},
      ver: 'v1'
    }
  });
 
  useEffect(() => {
    if (dlrDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('HP', dlrDetailData?.HP);
      setValue('EML', dlrDetailData?.EML);
      setSelectValue((props)=>({...props,
        DLR_ID:dlrDetailData?.DLR_ID,
        DLR_TP_CD:dlrDetailData?.DLR_TP_CD,
        NAT_ID:dlrDetailData?.NAT_ID,
        STE_ID:dlrDetailData?.STE_ID,
        CTY_ID:dlrDetailData?.CTY_ID}));
   
      setCityUrpId(dlrDetailData?.NAT_ID)
      setCountyUrpId(dlrDetailData?.STE_ID)
      clearErrors()
    }
  
  }, [dlrDetailData,clearErrors,setCityUrpId,setCountyUrpId,setValue]);

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
      type: 'DLR_DETAIL_RESET',
    });
  };

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (dlrDetailData?.DLR_ID !== undefined) {
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
const onSubmit = async () => {
  let formData= { ...selectValue}//subMit인풋 데이터 
  setPostFormData(() =>({...formData}));//subMit인풋 데이터
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
        try {
          const result = await addMutation();
          console.log(result)
          if(result.data.saveDealer.rsltCd === "OK"){
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
    if(editHandler(dlrDetailData,formData) === false){
      try {
        const result =await editMutation();
        console.log(result)
        if(result.data.saveDealer.rsltCd === "OK"){
          toast.success('성공적으로 수정 되었습니다.');
          detailSubmitDispatch(reset,dispatch,dlrDetailData?.DLR_ID)
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

const onSelecteds =(ev)=>{
  const { name, value } = ev.target;
   if(gridData?.map(item=>item.DLR_ID).some(comCd =>comCd === value)){
   toast.error("이미 딜러로 등록되어있습니다.")
   setSelectValue((props)=>({...props,DLR_ID:""}));
  }else{
    setSelectValue(props => ({ ...props, [name]: value }));
    if(name ==="NAT_ID"){
      setCityUrpId(value)
      setCountyUrpId(undefined)
      setSelectValue((props)=>({...props,STE_ID:""}));
      setSelectValue((props)=>({...props,CTY_ID:""}));
    }
    if(name ==="STE_ID"){
      setCountyUrpId(value)
      setSelectValue((props)=>({...props,CTY_ID:""}));
    }
  }
   
}

  return (
    <>
      <Box>
        <Card >
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>딜러 정보 상세</h5>

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
             
              <Grid item lg={3}   xs={12}>
                  <FormControl
                    style={{width:"100%"}}
                    size="small"
                    variant="outlined"
                    error={subMitFlag?.addFlag && selectValue?.DLR_ID === undefined? true :false}
                  >
                    <InputLabel>유저</InputLabel>
                    <Select
                      label="유저"
                      name="DLR_ID"
                      onChange={onSelecteds}
                      value={selectValue?.DLR_ID ||""}
                      readOnly={subMitFlag.addFlag ? false: true}
                    >
                   
                      {getUser?.getUser?.map(option => (
                        <MenuItem key={option.USR_ID} value={option.USR_ID}>
                          {`아이디:${option.USR_ID} 이름:${option.USR_NM}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              </Grid>
               <Grid item lg={3}   xs={12}>
                  <TextField
                      style={{ width: '100%' }}
                      label="HP"
                      type="number"
                      variant="outlined"
                      name="HP"
                      inputRef={register}
                      size="small"
                      InputProps={{ readOnly: true,startAdornment: <div></div>}}
                    />
                  </Grid>
              <Grid item lg={3} xs={12}>
                  <TextField
                      style={{ width: '100%' }}
                      label="EML"
                      variant="outlined"
                      name="EML"
                      inputRef={register}
                      size="small"
                      InputProps={{ readOnly: true,startAdornment: <div></div> }}
                    />
            </Grid>
                <Grid item lg={3}   xs={12}>
                   <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                      error={subMitFlag?.addFlag  && selectValue?.DLR_TP_CD === undefined ? true :false}
                    >
                      <InputLabel>딜러유형</InputLabel>
                      <Select
                        label="딜러유형"
                        name="DLR_TP_CD"
                        onChange={onSelecteds}
                        value={selectValue?.DLR_TP_CD ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                    
                        {dlr_tp_cd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
              </Grid>
                  <Grid item lg={4}   xs={12}>
                    <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                      error={subMitFlag?.addFlag && selectValue?.NAT_ID === undefined ? true :false}
                    >
                      <InputLabel>국가</InputLabel>
                      <Select
                        label="국가"
                        name="NAT_ID"
                        onChange={onSelecteds}
                        value={selectValue?.NAT_ID ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                    
                        {areacode?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
               </Grid>
                  <Grid item lg={4}   xs={12}>
                  <FormControl
                    style={{width:"100%"}}
                    size="small"
                    variant="outlined"
                    error={subMitFlag?.addFlag && selectValue?.STE_ID === undefined? true :false}
                  >
                    <InputLabel>시도</InputLabel>
                    <Select
                      label="시도"
                      name="STE_ID"
                      onChange={onSelecteds}
                      value={cityCode?.getArea !==undefined ?selectValue?.STE_ID||"" :""}
                      readOnly={inputReadOnly ? false: true}
                    >
                      {cityCode?.getArea?.map(option => (
                        <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                        {option.AREA_NM}
                      </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                  <Grid item lg={4}   xs={12}>
                  <FormControl
                    style={{width:"100%"}}
                    size="small"
                    variant="outlined"
                  >
                    <InputLabel>시군구</InputLabel>
                    <Select
                      label="시군구"
                      name="CTY_ID"
                      onChange={onSelecteds}
                      value={countyCode?.getArea !==undefined ?selectValue?.CTY_ID||"":""}
                      readOnly={inputReadOnly ? false: true}
                    >
                      {countyCode?.getArea?.map(option => (
                        <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                          {option.AREA_NM}
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
DealerDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(DealerDetail);

