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
  useMediaQuery,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDataDispatch } from './NewsContext';
import MultiSelects from 'react-multi-select-component';
import { GET_UPR_AREA, NTC_DATA } from './NewsQuery';
import { useQuery } from '@apollo/react-hooks';
import { searchSubmitDispatch } from './NewsComponent/NewsUtils';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {searchStyle} from "./NewsComponent/NewsStyle"
import styled from 'styled-components';
import Moment from 'moment'
import { netError } from 'src/components/netErrorHendle';
const NewsSearch = ({ className,areacode,setSelClear,sve_code,...rest}) => {
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }
  const classes = searchStyle();
  const dispatch = useDataDispatch();
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const [selectsValue, setSelectsValue] = useState({ // 국가,시도 값 저장 
    NAT_CD: '',
    STT_CD: ''
  });
  const [selected, setSelected] = useState([]); // 서비스 코드 값 저장 
  const { data: gridData,refetch,error } = useQuery(NTC_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    skip: param === undefined, 
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
  });
  const { data: uprAreaCode } = useQuery(GET_UPR_AREA, { // 국가 선택시 skip 값이 false로 바껴 쿼리 실행. 국가 선택에 따라 시도 선택 목록이 바뀜.
    skip: selectsValue.NAT_CD === '',
    variables: {
      param: {
        AREA_TP_CD: '002',
        UPR_AREA_ID: selectsValue?.NAT_CD
      },
      ver: 'v1'
    }
  });
  const [regDt,setRegDt]=useState(null)
/**
 * 국가,시도 선택시 입력함수
 * @param {object} event 국가,시도 선택된 Value값
 */
  const selectsChange = useCallback( event => { 
    const { name, value } = event.target;
    setSelectsValue(props => ({ ...props, [name]: value }));
  },[setSelectsValue]);

  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 NTC_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =useCallback(datas => { 
     Moment.suppressDeprecationWarnings = true;
      setParam({ 
        ...datas,
        REG_DT: Moment(regDt).format('YYYY.MM.DD') === "Invalid date" ?"" :Moment(regDt).format('YYYY.MM.DD'),
        ...selectsValue,
        SVC_CD_LST: selected?.map(item=>item.value).toString(),
      }); 
     searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      refetch();
    },[dispatch,refetch,regDt,setParam,selected,selectsValue]);

    useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getNotice
      });
     
    } 
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData,error, dispatch]);

  return (
    <div {...rest}>
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490? classes.formBox:null}>
              
              <Grid container spacing={1}>
                <Grid  style={{ width: media.w490 ?null :'100%' }} item>
                  <TextField
                    className={classes.formInputWidth}
                    style={{width : media.w490 ?null:"100%"}}
                  
                    label="제목"
                    variant="outlined"
                    type="text"
                    name="NTC_NM"
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
                        label="등록일"
                        format="yyyy-MM-dd"
                        onChange={(ev)=>setRegDt(ev)}
                        value={regDt}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  
                </Grid>

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
                      name="NAT_CD"
                      inputRef={register}
                      onChange={selectsChange}
                      value={
                        selectsValue.NAT_CD !== '' ? selectsValue.NAT_CD : ''
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
                      name="STT_CD"
                      value={
                        selectsValue.STT_CD !== '' ? selectsValue.STT_CD : ''
                      }
                      onChange={selectsChange}
                    >
                      <MenuItem value={""}>
                          전체
                        </MenuItem>
                      {uprAreaCode?.getArea?.map(option => (
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
                  <MultiSelect
                    options={
                      sve_code !== undefined
                        ? sve_code?.getCode.map(item => ({
                            label: item.COM_CD_NM,
                            value: item.COM_CD
                          }))
                        : []
                    }
                    value={selected}
                    onChange={setSelected}
                    hasSelectAll={false}
                    disableSearch={true}
                    overrideStrings={{
                      selectSomeItems: (
                        <span style={{ color: '#546E7A' }}>공지 대상</span>
                      ),
                      allItemsAreSelected: null
                    }}
                  />
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

NewsSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(NewsSearch);
const MultiSelect = styled(MultiSelects)`
    position: relative;
  z-index: 99;
  font-size:14px;
  width:240px;

    @media only screen and (max-width: 490px) {
    width: 100%;
    
    }
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
