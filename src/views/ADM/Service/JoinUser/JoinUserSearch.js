import React, {  useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, TextField, Grid, useMediaQuery } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import MultiSelects from 'react-multi-select-component';
import styled from 'styled-components';
import { useDataDispatch } from './JoinUserContext';
import { JOIN_USER } from './JoinUserQuery';
import { useQuery } from '@apollo/react-hooks';
import {  netError } from 'src/components/netErrorHendle';
import { searchStyle } from './JoinUserComponent/JoinUserStyle';




const JoinUserSearch = ({ svcCd }) => {
  const classes = searchStyle();
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }
  const { register, handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 유저 조회시 POST 보내는 값
  const [selected, setSelected] = useState([]);
  const dispatch = useDataDispatch();
  const { data: gridData, refetch, error } = useQuery(JOIN_USER, {
    skip: param === undefined,
    fetchPolicy: 'network-only',
    variables: { param, ver: 'v1' }
  });

  const onSubmit = datas => {
      setParam({ ...datas,  SVC_CD_LST:selected?.map(item=>item.value).toString(), USR_TP_CD: '' }); //조회 인풋값은 받아와 조회함
      dispatch({
        type: 'SEL_CLEAR'
      });
      dispatch({
        type: 'SUBMET_RESET'
     });
      refetch();
    }

  useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getSvcUser
      });
    }
    if (error !== undefined) {
      netError(error)
    }
  }, [gridData, error, dispatch]);

  return (
    <div>
      <Box >
        <Card className={media.w490 ? classes.searchCard:classes.w490searchCard} >
          <form onSubmit={handleSubmit(onSubmit)}  >
          <Box className={media.w490 ?classes.searchInputBox:null}> 
              <Grid  container spacing={1}>
                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="아이디"
                    variant="outlined"
                    type="text"
                    name="USR_ID"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="이름"
                    variant="outlined"
                    type="text"
                    name="USR_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>

                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="HP"
                    variant="outlined"
                    type="number"
                    name="HP"
                    inputRef={register}
                    size="small"
                  />
                </Grid>

                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="EMAIL"
                    variant="outlined"
                    type="text"
                    name="EML"
                    inputRef={register}
                    size="small"
                  />
                </Grid>

                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="닉네임"
                    variant="outlined"
                    type="text"
                    name="NIC_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
                <Grid item  lg={3}   xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="홈샵"
                    variant="outlined"
                    type="text"
                    name="HME_SHP_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
                <Grid item  lg={6}   xs={12}>
                  <MultiSelect
                  className={classes.multiSelect}
                    options={
                      svcCd !== undefined
                        ? svcCd?.getCode.map(item => ({
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
                        <span style={{ color: '#546E7A' }}>서비스</span>
                      ),
                      allItemsAreSelected: svcCd?.getCode.map(
                        item => `${item.COM_CD_NM}, `
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Button
              className={media.w490 ? classes.button:classes.w490button}
                onClick={() =>
                  dispatch({
                    type: 'READ_ONLY'
                  })
                }
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

JoinUserSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(JoinUserSearch);
const MultiSelect = styled(MultiSelects)`
  position: relative;
  z-index: 99;
 
  font-size:12px;
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
