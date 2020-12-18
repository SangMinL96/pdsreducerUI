import React, {  useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  TextField,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDataDispatch } from './AreaNatContext';
import { GET_AREA_DATA } from './AreaNatQuery';
import { useQuery } from '@apollo/react-hooks';
import { searchSubmitDispatch } from './AreaNatComponent/AreaNatUtils';
import {searchStyle} from "./AreaNatComponent/AreaNatStyle"
import { useGlobalDispatch } from '../AreaGlobalContext';
import { netError } from 'src/components/netErrorHendle';

const AreaNatSearch = () => {
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }
  const classes = searchStyle();
  const dispatch = useDataDispatch();
  const globalDispatch = useGlobalDispatch()
  const {  handleSubmit,register } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const { data: gridData,refetch,error } = useQuery(GET_AREA_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    fetchPolicy: 'network-only',
    skip: param === undefined, 
    variables: { param: {...param},ver: 'v1' },
  });
  
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 NTC_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =useCallback((data) => { 
      setParam({...data,AREA_TP_CD:'001',}); 
      searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      globalDispatch({
        type: "CITY_RESET",
        boolean:true
      })
      globalDispatch({
        type: "COUNTY_RESET",
         boolean:true
      })
      refetch();
    },[dispatch,globalDispatch,refetch,setParam]);


    useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getArea
      });
     
    } 
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData,error, dispatch]);

  return (
    <div >
      <Box className={classes.searchBox} >
        <Card className={media.w490?classes.searchCard:classes.w490searchCard}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490? classes.formBox:null}>
              <Grid container spacing={1}>
                <Grid  style={{ width: '100%' }} item>
                <TextField
                      // error={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? true : false  }
                      // helperText={validate(errors?.MCN_SW_REPO_NM,getValues("MCN_SW_REPO_NM")) ? '저장소 명를 입력해주세요.':false}
                      style={{ width: '100%' }}
                      label="국가명"
                      fullWidth
                      variant="outlined"
                      name="AREA_NM"
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

AreaNatSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(AreaNatSearch);
