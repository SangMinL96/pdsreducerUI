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
import { useDataDispatch } from './GameContext';
import {  GET_GAME_DATA } from './GameQuery';
import { useQuery } from '@apollo/react-hooks';

import { searchSubmitDispatch} from 'src/components/dispatchs';

import {searchStyle} from "./GameComponent/GameStyle"

import { netError } from 'src/components/netErrorHendle';
import ReactHookFormSelect from 'src/components/ReactHookFormSelect';

const GameSearch = ({ svc_code,media}) => {
  const classes = searchStyle();
  const dispatch = useDataDispatch();

  const { register, handleSubmit,control,setValue,getValues } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  
  const { data: gridData,refetch,error } = useQuery(GET_GAME_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    skip: param === undefined, 
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only'
  });
 
  
  
  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 GET_GAME_DATA useQuery 실행 시킴. 
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
          gridData: gridData?.getGame
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
                <Grid  lg={6} xs={12} item>
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
                <Grid  lg={6} xs={12} item>
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

GameSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(GameSearch);

