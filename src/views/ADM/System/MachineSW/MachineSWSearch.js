import React, {   useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDataDispatch } from './MachineSWContext';
import MultiSelects from 'react-multi-select-component';
import { MCN_SW_DATA } from './MachineSWQuery';
import { useQuery } from '@apollo/react-hooks';
import { searchSubmitDispatch } from './MachineSWComponent/MachineSWUtils';

import {searchStyle} from "./MachineSWComponent/MachineSWStyle"
import styled from 'styled-components';
import { netError } from 'src/components/netErrorHendle';

const MachineSWSearch = ({ className,areacode,setSelClear,svc_code,...rest}) => {
  const media = {
    w490 :useMediaQuery('(min-width:490px)'),
  }
  const classes = searchStyle();
  const dispatch = useDataDispatch();
  const {  handleSubmit } = useForm(); // 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리)
  const [param, setParam] = useState(); // 조회시 POST 보내는 값
  const [selectsValue, setSelectsValue] = useState();
  const { data: gridData,refetch,error } = useQuery(MCN_SW_DATA, { // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
    skip: param === undefined, 
    variables: { SVC_CD:param||"", ver: 'v1' },
    fetchPolicy: 'network-only',
   
  });

  /**
 * 조회시 인풋 값을 받아와 setParam저장시켜 NTC_DATA useQuery 실행 시킴. 
 * @param {object} datas 인풋 Value 값
 */
  const onSubmit =() => { 
      setParam(selectsValue !==undefined ?selectsValue?.map(item=>item.value).toString():""); 
      searchSubmitDispatch(dispatch) //조회시 리셋 디스패치 실행 함수
      refetch();
    };


    useEffect(() => {
    if (gridData !== undefined) {
      dispatch({
        type: 'GET_GRID_DATA',
        gridData: gridData?.getMcnSwRepo
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
                  <MultiSelect
                    options={
                      svc_code !== undefined
                        ? svc_code?.getCode.map(item => ({
                            label: item.COM_CD_NM,
                            value: item.COM_CD
                          }))
                        : []
                    }
                    value={selectsValue}
                    onChange={(ev)=>setSelectsValue(ev)}
                    hasSelectAll={false}
                    disableSearch={true}
                    overrideStrings={{
                      selectSomeItems: (
                        <span style={{ color: '#546E7A' }}>서비스 명</span>
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

MachineSWSearch.propTypes = {
  className: PropTypes.string
};

export default React.memo(MachineSWSearch);
const MultiSelect = styled(MultiSelects)`
    position: absolute;
  z-index: 99;
  font-size:14px;
  width: 300px;
  @media only screen and (max-width: 815px) {
    width: 210px;
    }
    @media only screen and (max-width: 490px) {
    width: 92.5%;
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
