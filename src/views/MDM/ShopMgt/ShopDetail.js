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
  InputLabel,
  FormControl
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './ShopContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  disabledHandler, validate } from 'src/components/Utils';
import { SHOP_ADD,GET_SHOP_DATA,SHOP_EDIT } from './ShopQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import { editHandler, variables} from "./ShopComponent/ShopUtils"
import {detailStyle} from "./ShopComponent/ShopStyle"
import { addClickDispatch, editClickDispatch, detailSubmitDispatch} from 'src/components/dispatchs';

function ShopDetail({media,areacode,setCityUrpId,setCountyUrpId,shp_ctg_cd,dlrData,cityCode,countyCode}) {
  const dispatch = useDataDispatch();
 
  const classes = detailStyle();
  const { shopDetailData, inputReadOnly ,subMitFlag } = useDataState();
  const { register, handleSubmit,  reset, setValue,clearErrors,errors,getValues  } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 SHOP_ADD 뮤테이션 데이터
  const [selectValue,setSelectValue] = useState({
    DLR_ID:"",
    SHP_CTG_CD:"",
    NAT_ID:"",
    STE_ID:"",
    CTY_ID:"",
})
let mutationParams = { variables: {shop: postFormData,ver: 'v1'}}
const [addMutation] = useMutation(SHOP_ADD, mutationParams);
const [editMutation] = useMutation(SHOP_EDIT,mutationParams);
  const [refetch ] = useLazyQuery(GET_SHOP_DATA, variables({SHP_NM:""}));
 
  useEffect(() => {
    if (shopDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('SHP_ID', shopDetailData?.SHP_ID);
      setValue('SHP_NM', shopDetailData?.SHP_NM);
      setValue('SHP_ADDR', shopDetailData?.SHP_ADDR);
      setSelectValue((props)=>({...props,
        DLR_ID:shopDetailData?.DLR_ID,
        SHP_CTG_CD:shopDetailData?.SHP_CTG_CD,
        NAT_ID:shopDetailData?.NAT_ID,
        STE_ID:shopDetailData?.STE_ID,
        CTY_ID:shopDetailData?.CTY_ID}));
      setCityUrpId(shopDetailData?.NAT_ID)
      setCountyUrpId(shopDetailData?.STE_ID)
      clearErrors()
    }
  
  }, [shopDetailData,clearErrors,setValue, setSelectValue,setCityUrpId,setCountyUrpId]);

  /**
 * 신규 클릭시 디스패치 이용한 상태 변경 함수
 */
  const inputReset = () => {addClickDispatch(dispatch)};

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {editClickDispatch(dispatch,shopDetailData?.SHP_ID,toast) };
   
 /**
 * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시 
 * submit Flag의 따라 실행되는 함수.
 * @param {object} data 인풋 데이터
 */
const onSubmit = async (datas) => {
  let formData= { ...selectValue,...datas}//subMit인풋 데이터 
    setPostFormData(() =>({...formData}));//subMit인풋 데이터
      if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
        try {
        const result = await addMutation();
        console.log(result)
        if(result.data.saveShop.rsltCd === "OK"){
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
        if(editHandler(shopDetailData,formData) === false){
          try {
            const result =await editMutation();
            console.log(result)
            if(result.data.saveShop.rsltCd === "OK"){
              toast.success('성공적으로 수정 되었습니다.');
              detailSubmitDispatch(reset,dispatch)
              dispatch({
                type: 'SEL_FOCUS',
                selFocusId:shopDetailData?.SHP_ID
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

const onSelecteds =(ev)=>{
  const { name, value } = ev.target;
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

  return (
    <>
      <Box>
        <Card >
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>샵 정보 상세</h5>

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
                      <TextField
                           error={validate(errors?.SHP_ID,getValues("SHP_ID")) ? true : false  }
                           helperText={validate(errors?.SHP_ID,getValues("SHP_ID")) ?  '샵 ID를 입력해주세요.':false}
                          style={{ width: '100%' }}
                          label="샵 ID"
                          variant="outlined"
                          name="SHP_ID"
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
                    <Grid item lg={3} xs={12}>
                      <TextField
                       error={validate(errors?.SHP_NM,getValues("SHP_NM")) ? true : false  }
                       helperText={validate(errors?.SHP_NM,getValues("SHP_NM")) ?  '샵 명을 입력해주세요.':false}
                          style={{ width: '100%' }}
                          label="샵 명"
                          variant="outlined"
                          name="SHP_NM"
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
              <Grid item lg={3} xs={12}>
                   <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel>샵 카테고리</InputLabel>
                      <Select
                        label="샵 카테고리"
                        name="SHP_CTG_CD"
                        onChange={onSelecteds}
                        value={selectValue?.SHP_CTG_CD ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                        {shp_ctg_cd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
              </Grid>
              <Grid item lg={3}   xs={12}>
                  <FormControl
                    style={{width:"100%"}}
                    size="small"
                    variant="outlined"
                   
                  >
                    <InputLabel>딜러유형/아이디/이름</InputLabel>
                      <Select
                        label="딜러유형/아이디/이름"
                        name="DLR_ID"
                        onChange={onSelecteds}
                        value={dlrData?.getDealerTree !==undefined? selectValue?.DLR_ID ||"":""}
                        readOnly={inputReadOnly ? false: true}
                      >
                        {dlrData?.getDealerTree?.map(option => (
                          <MenuItem key={option.DLR_ID} value={option.DLR_ID}>
                            {`${option.DLR_TP_NM} / ${option.DLR_ID} / ${option.USR_NM} `}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
              </Grid>
              <Grid item lg={3}   xs={12}>
              <TextField
                      style={{ width: '100%' }}
                      label="주소"
                      variant="outlined"
                      name="SHP_ADDR"
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
              <Grid item lg={3}   xs={12}>
                    <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                    
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
               <Grid item lg={3}   xs={12}>
                  <FormControl
                    style={{width:"100%"}}
                    size="small"
                    variant="outlined"
                   
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
                <Grid item lg={3}   xs={12}>
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
ShopDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(ShopDetail);

