import React, {  useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDataDispatch } from './ShopContext';
import { GET_UPR_AREA, GET_SHOP_DATA } from './ShopQuery';
import { useQuery } from '@apollo/react-hooks';
import { areaVariables } from './ShopComponent/ShopUtils';
import { searchSubmitDispatch} from 'src/components/dispatchs';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {searchStyle} from "./ShopComponent/ShopStyle"
import Moment from 'moment'
import { netError } from 'src/components/netErrorHendle';

const ShopSearch = ({ areacode,shp_ctg_cd,media}) => {
  const classes = searchStyle();
  const dispatch = useDataDispatch();
  const [cityUrpId,setCityUrpId]=useState('')
  const [countyUrpId,setCountyUrpId]=useState('')
  const [startRegDt,setStartRegDt]=useState(null)
  const [endRegDt,setEndRegDt]=useState(null)
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const [selectsValue, setSelectsValue] = useState({ // 국가,시도 값 저장 
    NAT_ID:"",
    STE_ID:"",
    CTY_ID:"",
    SHP_CTG_CD:""
  });
  const { data: gridData,refetch,error } = useQuery(GET_SHOP_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    skip: param === undefined, 
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only'
  });
  const { data: cityCode } = useQuery(GET_UPR_AREA, areaVariables("002",cityUrpId));
  const { data: countyCode } = useQuery(GET_UPR_AREA, areaVariables("003",countyUrpId));
  
  
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 GET_SHOP_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =useCallback(datas => { 
    Moment.suppressDeprecationWarnings = true;
      setParam({ 
        ...datas,
        ...selectsValue,
        STRT_REG_DT: Moment(startRegDt).format('YYYY.MM.DD') === "Invalid date" ?"" :Moment(startRegDt).format('YYYY.MM.DD'),
        END_REG_DT: Moment(endRegDt).format('YYYY.MM.DD') === "Invalid date" ?"" :Moment(endRegDt).format('YYYY.MM.DD'),
      }); 
      searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      refetch();
    },[dispatch,refetch,startRegDt, endRegDt,setParam,selectsValue]);
    
    
    useEffect(() => {
      if (gridData !== undefined) {
        dispatch({
          type: 'GET_GRID_DATA',
          gridData: gridData?.getShop
        });
        
      } 
      if (error !== undefined) {
      netError(error)
    }
    }, [gridData,error, dispatch]);

    /**
     * 국가,시도 선택시 입력함수
     * @param {object} event 국가,시도 선택된 Value값
     */
      const selectsChange = useCallback( event => { 
        const { name, value } = event.target
        setSelectsValue(props => ({ ...props, [name]: value }));
        if(name ==="NAT_ID"){
          setCityUrpId(value)
          setCountyUrpId(undefined)
          setSelectsValue((props)=>({...props,STE_ID:""}));
          setSelectsValue((props)=>({...props,CTY_ID:""}));
        }
        if(name ==="STE_ID"){
          setCountyUrpId(value)
          setSelectsValue((props)=>({...props,CTY_ID:""}));
        }
      },[setSelectsValue,setCityUrpId,setCountyUrpId]);
    
    return (
      <div >
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490? classes.formBox:null}>
              <Grid container spacing={1}>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <FormControl
                    size="small"
                    variant="outlined"
                     className={classes.formInputWidth}
                      style={{width : media.w490 ?null:"100%"}}
                  >
                    <InputLabel>국가</InputLabel>
                    <Select
                      label="국가"
                      name="NAT_ID"
                      onChange={selectsChange}
                      value={
                        selectsValue.NAT_ID !== '' ? selectsValue.NAT_ID : ''
                      }
                    >
                        <MenuItem value={""}>
                          전체
                        </MenuItem>
                      {areacode?.getArea?.map(option => (
                        <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                          {option.AREA_NM}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <FormControl
                    size="small"
                    variant="outlined"
                     className={classes.formInputWidth}
                      style={{width : media.w490 ?null:"100%"}}
                  >
                    <InputLabel>시도</InputLabel>
                    <Select
                      label="시도"
                      name="STE_ID"
                      value={
                        selectsValue.STE_ID !== '' ? selectsValue.STE_ID : ''
                      }
                      onChange={selectsChange}
                    >
                      <MenuItem value={""}>
                          전체
                        </MenuItem>
                      {cityCode?.getArea?.map(option => (
                        <MenuItem
                          key={option.AREA_ID}
                          value={option.AREA_ID}
                        >
                          {option.AREA_NM}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <FormControl
                    size="small"
                    variant="outlined"
                     className={classes.formInputWidth}
                      style={{width : media.w490 ?null:"100%"}}
                  >
                    <InputLabel>시군구</InputLabel>
                    <Select
                      label="시군구"
                      name="CTY_ID"
                      value={
                        selectsValue.CTY_ID !== '' ? selectsValue.CTY_ID : ''
                      }
                      onChange={selectsChange}
                    >
                      <MenuItem value={""}>
                          전체
                        </MenuItem>
                      {countyCode?.getArea?.map(option => (
                        <MenuItem
                          key={option.AREA_ID}
                          value={option.AREA_ID}
                        >
                          {option.AREA_NM}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <FormControl
                    size="small"
                    variant="outlined"
                     className={classes.formInputWidth}
                      style={{width : media.w490 ?null:"100%"}}
                  >
                    <InputLabel>샵 카테고리</InputLabel>
                    <Select
                      label="샵 카테고리"
                      name="SHP_CTG_CD"
                      value={selectsValue.SHP_CTG_CD || ''}
                      onChange={selectsChange}
                    >
                      <MenuItem value={""}>
                          전체
                        </MenuItem>
                      {shp_ctg_cd?.getCode?.map(option => (
                        <MenuItem
                          key={option.COM_CD}
                          value={option.COM_CD}
                        >
                          {option.COM_CD_NM}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <TextField
                    className={classes.formInputWidth}
                    style={{width : media.w490 ?null:"100%"}}
                    label="샵 명"
                    variant="outlined"
                    type="text"
                    name="SHP_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
                 <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                     <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          style={{width : media.w490 ?null:"100%"}}
                          autoOk
                          variant="inline"
                          inputVariant="outlined"
                          label="시작일"
                          format="yyyy-MM-dd"
                          onChange={(ev)=>setStartRegDt(ev)}
                          value={startRegDt}
                          size="small"
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                     <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          style={{width : media.w490 ?null:"100%"}}
                          autoOk
                          variant="inline"
                          inputVariant="outlined"
                          label="마지막일"
                          format="yyyy-MM-dd"
                          onChange={(ev)=>setEndRegDt(ev)}
                          value={endRegDt}
                          size="small"
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </Box>
            <Box >
              <Button
                onClick={() =>
                  dispatch({
                    type: 'READ_ONLY'
                  })
                }
                
                className={media.w490 ?classes.button:classes.w490button}
                type="submit"
                variant="contained"
                color="primary"
              >
                조회
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
    </div>
  );
};

ShopSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(ShopSearch);

