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
  FormHelperText,
  
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDataDispatch } from './MachineSttgContext';
import {  GET_MachineSttg_DATA } from './MachineSttgQuery';
import { useQuery } from '@apollo/react-hooks';

import { searchSubmitDispatch} from 'src/components/dispatchs';

import {searchStyle} from "./MachineSttgComponent/MachineSttgStyle"

import { netError } from 'src/components/netErrorHendle';
import ReactHookFormSelect from 'src/components/ReactHookFormSelect';

const MachineSttgSearch = ({ svc_code,media}) => {
  const classes = searchStyle();
  const dispatch = useDataDispatch();

  const { register, handleSubmit,control,setValue,getValues } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const [selectValue,setSelectValue,inputReadOnly] = useState({})
  const { data: gridData,refetch,error } = useQuery(GET_MachineSttg_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    skip: param === undefined, 
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only'
  });
 
  
  
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 GET_MachineSttg_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =datas => { 
   
    console.log(datas)
      setParam({...datas,}); 
      searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      refetch();
    };
    
    
    useEffect(() => {
    
      if (gridData !== undefined) {
        dispatch({
          type: 'GET_GRID_DATA',
          gridData: gridData?.getMachineSttg
        });
        
      } 
      if (error !== undefined) {
      netError(error)
    }
    }, [gridData,error, setValue,dispatch]);

  
    
    return (
      <div >
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490? classes.formBox:null}>
              <Grid container spacing={1}>
                <Grid  lg={4} xs={12} item>
                <ReactHookFormSelect
                    name="SVC_CD"
                    size="small"
                    label="서비스"
                    control={control}
                    defaultValue={""}
                    variant="outlined"
                    style={{width :"100%"}}
                    >
                    {svc_code?.getCode?.map(option => (
                      <MenuItem
                        key={option.COM_CD}
                        value={option.COM_CD}
                      >
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </ReactHookFormSelect>
                </Grid>
                <Grid item lg={4} xs={12}>
                  <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                      // error={inputReadOnly?postFormData?.SVC_CD ===undefined ?true :false:false}
                    >
                      <InputLabel>모델명</InputLabel>
                      <Select
                        label="모델명"
                        name="SVC_CD"
                        onChange={(ev)=>setSelectValue(ev.target.value)}
                        value={selectValue?.SVC_CD ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                    
                    {/* {svc_code?.getCode?.map(option => (
                          <MenuItem
                            key={option.COM_CD}
                            value={option.COM_CD}
                          >
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))} */}
                      </Select>
                      <FormHelperText>{inputReadOnly?selectValue?.SVC_CD ===undefined ?"서비스를 선택해주세요." :false:false}</FormHelperText>
                    </FormControl>
                    
                  </Grid>
                <Grid  lg={4} xs={12} item>
                  <TextField
                    style={{width :"100%"}}
                    label="게임 명"
                    variant="outlined"
                    type="text"
                    name="GME_NM"
                    inputRef={register}
                    size="small"
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

MachineSttgSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(MachineSttgSearch);

