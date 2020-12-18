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
  Grid,
  useMediaQuery,
  
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { GET_SCRN } from './ScrnQuery';
import { useQuery } from '@apollo/react-hooks';
import { useDataDispatch } from './ScrnContext';
import {  netError } from 'src/components/netErrorHendle';
import {  searchStyle } from './ScrnComponent/ScrnStyle';
const ScrnSearch = ({ className, svcCd, setSelClear, ...rest }) => {
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }

  const classes = searchStyle();
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 유저 조회시 POST 보내는 값

  const [selectValue, setSelectValue] = useState(''); // 서비스 선택시 해당 값 상태
  
  const dispatch = useDataDispatch();
  const { data: gridData, error, refetch } = useQuery(GET_SCRN, {
    returnPartialData: true,
    skip: param === undefined,
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });




  const onSubmit =useCallback( async datas => {
    setParam({ ...datas, SVC_CD: selectValue}); //조회 인풋값은 받아와 조회함
    dispatch({
      type: 'SEL_CLEAR'
    });
    setTimeout(
      dispatch({
        type: 'SEL_CLEAR_FALSE'
      }),
      300
    );
    dispatch({
      type: 'SCRN_DETAIL_RESET'
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
        gridData: gridData?.getScreen
      });
    }
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData, error, dispatch]);

  return (
    <div {...rest}>
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box  style={{width :"35%"}} >
              <Grid container spacing={1}>
                <Grid  lg={6}   xs={12} item>
                  <TextField
                    style={{width :"100%"}}                 
                    label="화면명"
                    variant="outlined"
                    type="text"
                    name="SCRN_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
                <Grid lg={6}   xs={12}  item>
                  <FormControl
                      size="small"
                      variant="outlined"
                      style={{width :"100%"}}  
                    >
                    <InputLabel>서비스</InputLabel>
                    <Select
                      label="서비스"
                      value={'' || selectValue}
                      onChange={(ev)=>setSelectValue(ev.target.value)}
                    >
                    {svcCd?.getCode?.map(option => (
                      <MenuItem key={option.COM_CD} value={option.COM_CD}>
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box>
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

ScrnSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(ScrnSearch);
