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
  Grid,
  
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { ADMIN_USER } from './AdminUserQuery';
import { useQuery } from '@apollo/react-hooks';
import { useDataDispatch } from './AdminUserContext';
import {  netError } from 'src/components/netErrorHendle';
import {  searchStyle } from './AdminUserComponent/AdminUserStyle';
import { useTranslation } from "react-i18next";

const AdminUserSearch = ({ className, userType, setSelClear, ...rest }) => {
  const media = {
    
    w490 : useMediaQuery('(min-width:490px)'),
  }
  const classes = searchStyle();
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 유저 조회시 POST 보내는 값
  const [selectValue, setSelectValue] = useState(''); // 유형 선택시 해당 값 상태
  const dispatch = useDataDispatch();
  const { data: gridData, error, refetch } = useQuery(ADMIN_USER, {
    skip: param === undefined,
    variables: { param, ver: 'v1' },
    fetchPolicy: 'network-only',
  });

  const { t } = useTranslation();

  const onSubmit =useCallback( async datas => {
    setParam({ ...datas, USR_TP_CD: selectValue }); //조회 인풋값은 받아와 조회함
    dispatch({
      type: 'SEL_CLEAR'
    });

    dispatch({
      type: 'USER_DETAIL_RESET'
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
        gridData: gridData?.getUser
      });
    }
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData,error,dispatch]);

  return (
    <div {...rest}>
      <h1>{t('000:001.LB_ADD')}</h1>
      <Box>
        <Card className={classes.searchCard}>
          <form onSubmit={handleSubmit(onSubmit)}>
           <Box className={media.w490 ? classes.formBox:classes.w490formBox} >
            <Grid container spacing={1} style={{ width:media.w490 ? "60%":"100%"}}>
              <Grid item  lg={4}   xs={12}>
                <TextField
                  style={{ width:"100%"}}
                  label="아이디"
                  variant="outlined"
                  type="text"
                  name="USR_ID"
                  inputRef={register}
                  size="small"
                />
              </Grid>

               <Grid item  lg={4}   xs={12}>
                <TextField
                    style={{ width:"100%"}}
                  label="이름"
                  variant="outlined"
                  type="text"
                  name="USR_NM"
                  inputRef={register}
                  size="small"
                />
                </Grid>

                 <Grid item  lg={4}   xs={12}>
                <FormControl
                  style={{ width:"100%"}}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel>유형</InputLabel>
                  <Select
                    label="유형"
                  
                    value={'' || selectValue}
                    onChange={(ev)=>setSelectValue(ev.target.value)}
                  >
                     <MenuItem value={""}>
                        전체
                      </MenuItem>
                    {userType?.getCode?.map(option => (
                      <MenuItem key={option.COM_CD} value={option.COM_CD}>
                        {option.COM_CD_NM}
                      </MenuItem>
                    ))}
                  </Select>
                 </FormControl>
                </Grid>
              </Grid>
                
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

AdminUserSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(AdminUserSearch);
