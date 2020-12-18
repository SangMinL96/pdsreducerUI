import React, { useCallback, useEffect, useState } from 'react';
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
  useMediaQuery,
  
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { GET_API } from './ApiQuery';
import { useQuery } from '@apollo/react-hooks';
import { useDataDispatch } from './ApiContext';
import {  netError } from 'src/components/netErrorHendle';
import {  searchStyle } from './ApiComponent/ApiStyle';

const ApiSearch = ({ className, mdleType, setSelClear, ...rest }) => {
  const media = {
    w1010 : useMediaQuery('(min-width:1010px)'),
    w727 : useMediaQuery('(min-width:727px)'),
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const inputMedia={width:media.w490 ?'260px':"100%" ,marginLeft:media.w727? '1em':0,           marginTop:media.w727? 0:'0.5em'}

  const classes = searchStyle();
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 유저 조회시 POST 보내는 값
  const [selectValue, setSelectValue] = useState(''); // 유형 선택시 해당 값 상태
  const dispatch = useDataDispatch();
  const { data: gridData, error, refetch } = useQuery(GET_API, {
    skip: param === undefined,
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
     
  });




  const onSubmit =useCallback( async datas => {
    setParam({ ...datas, MDLE_CD: selectValue }); //조회 인풋값은 받아와 조회함
    dispatch({
      type: 'SEL_CLEAR'
    });
   
    dispatch({
      type: 'API_DETAIL_RESET'
    });
    dispatch({
      type: 'SUBMET_RESET'
    });

    refetch();
  },[selectValue,refetch,dispatch]);

  useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getApi
      });
    }
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData, error, dispatch]);

  return (
    <div {...rest}>
      <Box>
        <Card className={classes.searchCard}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490 ? classes.formBox:classes.w490formBox} >
              <div >
                <TextField
                  style={{ width:media.w490 ?'260px':"100%"}}
                  label="API명"
                  variant="outlined"
                  type="text"
                  name="API_NM"
                  inputRef={register}
                  size="small"
                />
                <TextField
                  style={inputMedia}
                  label="버전"
                  variant="outlined"
                  type="text"
                  name="API_VER"
                  inputRef={register}
                  size="small"
                />
                <FormControl
                  style={inputMedia}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel>모듈</InputLabel>
                  <Select
                    label="모듈"
                  
                    value={'' || selectValue}
                    onChange={(ev)=>setSelectValue(ev.target.value)}
                  >
                    {mdleType?.getCode?.map(option => (
                      <MenuItem key={option.COM_CD} value={option.COM_CD}>
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button
               className={media.w490 ? classes.button: classes.w490button}
                onClick={() =>
                  dispatch({
                    type: 'READ_ONLY'
                  })
                }
                type="submit"
                variant="contained"
                color="primary"
                size="small"
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

ApiSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(ApiSearch);
