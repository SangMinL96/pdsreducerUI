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
import { useDataDispatch } from './CodeGroupContext';
import { GET_CODE_DATA } from './CodeGroupQuery';
import { useQuery } from '@apollo/react-hooks';
import { searchSubmitDispatch } from './CodeGroupComponent/CodeGroupUtils';
import {searchStyle} from "./CodeGroupComponent/CodeGroupStyle"
import { netError } from 'src/components/netErrorHendle';


const CodeGroupSearch = ({ setGrpId}) => {
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }
  const classes = searchStyle();
  const dispatch = useDataDispatch();
  const {  handleSubmit,register } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const { data: gridGroupData,refetch,error } = useQuery(GET_CODE_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    fetchPolicy: 'network-only',
    skip: param === undefined, 
    variables: {param,ver: 'v1' },
  });
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 NTC_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =useCallback((data) => { 
      setParam({...data}); 
      searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      setGrpId(undefined)
      refetch();
    },[dispatch,refetch,setGrpId,setParam]);


    useEffect(() => {
    if (gridGroupData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridGroupData: gridGroupData?.getCodeGrp
      });
     
    } 
    if (error !== undefined) {
      netError(error)
    }
  }, [gridGroupData,error, dispatch]);

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
                      label="코드그룹명"
                      fullWidth
                      variant="outlined"
                      name="COM_CD_GRP_NM"
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

CodeGroupSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(CodeGroupSearch);
