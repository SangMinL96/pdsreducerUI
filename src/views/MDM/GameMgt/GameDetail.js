import React, {   useEffect,    useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  toast } from 'react-toastify';
import { useDataDispatch, useDataState } from './GameContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  disabledHandler, validate } from 'src/components/Utils';
import { GAME_ADD,GET_GAME_DATA,GAME_EDIT } from './GameQuery';
import {  useLazyQuery, useMutation } from '@apollo/react-hooks';
import { editHandler, variables} from "./GameComponent/GameUtils"
import {detailStyle} from "./GameComponent/GameStyle"
import { addClickDispatch, editClickDispatch, detailSubmitDispatch} from 'src/components/dispatchs';
import GameDetailTable from './GameComponent/GameDetailTable';


function GameDetail({media,svc_code,gme_ctg_code,mcn_mdl_code}) {
  const dispatch = useDataDispatch();
  const classes = detailStyle();
  const { gameDetailData, inputReadOnly ,subMitFlag } = useDataState();
  const { register, handleSubmit,  reset, setValue,clearErrors,getValues  } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 GAME_ADD 뮤테이션 데이터
  const [selectValue,setSelectValue] = useState({
    SVC_CD:"",
    GME_CTG_CD:"",
    HNDI_YN:"",
})


  const [mcnMdlId,setMcnMdlId] =useState()
  let mutationParams = { variables: {game: postFormData,ver: 'v1'}}
  const [addMutation] = useMutation(GAME_ADD, mutationParams);
  const [editMutation] = useMutation(GAME_EDIT,mutationParams);
  const [refetch ] = useLazyQuery(GET_GAME_DATA, variables({GME_NM:""}));

  useEffect(() => {
    if ( gameDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('GME_ID', gameDetailData?.GME_ID);
      setValue('GME_NM', gameDetailData?.GME_NM);
      setValue('GME_CRD', gameDetailData?.GME_CRD);
      setValue('GME_RND_VAL', gameDetailData?.GME_RND_VAL);
      setValue('GME_DESC', gameDetailData?.GME_DESC);
      setSelectValue((props)=>({...props,
        SVC_CD:gameDetailData?.SVC_CD,
        GME_CTG_CD:gameDetailData?.GME_CTG_CD,
        HNDI_YN:gameDetailData?.HNDI_YN,
       }));
      clearErrors()
    }

  }, [gameDetailData,setSelectValue,clearErrors,setValue]);


  /**
 * 신규 클릭시 디스패치 이용한 상태 변경 함수
 */
  const inputReset = () => {addClickDispatch(dispatch,reset)};

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {editClickDispatch(dispatch,gameDetailData?.GME_ID,toast) };
   
 /**
 * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시 
 * submit Flag의 따라 실행되는 함수.
 * @param {object} data 인풋 데이터
 */
const onSubmit = async (datas) => {

    let formData= { ...datas,...selectValue,MCN_MDL_CD_LST:mcnMdlId?.toString()||""}//subMit인풋 데이터 
    setPostFormData(() =>({...formData}));//subMit인풋 데이터
      if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
        try {
        const result = await addMutation();
        console.log(result)
        if(result.data.saveGame.rsltCd === "OK"){
          toast.success('성공적으로 추가 되었습니다.');
          detailSubmitDispatch(reset,dispatch)
        }else{
          toast.error('다시시도 해주세요.');
        }
        refetch()
      } catch (error) {
        console.log(error);
        dispatch({
          type: 'SUBMET_RESET'
        });
      }
    }
  if (subMitFlag?.editFlag === true) { //수정 subMit 실행 함수
        if(editHandler(gameDetailData,formData) === false){
          try {
            const result =await editMutation();
            console.log(result)
            if(result.data.saveGame.rsltCd === "OK"){
              toast.success('성공적으로 수정 되었습니다.');
              detailSubmitDispatch(reset,dispatch)
              dispatch({
                type: 'SEL_FOCUS',
                selFocusId:gameDetailData?.GME_ID
              });
            }
            refetch()
          } catch (error) {
            console.log(error);
            dispatch({
              type: 'SUBMET_RESET'
            });
          }
        }else{
          toast.error("수정한 내용이 전과 동일합니다.")
        }
  }
};
const onSelecteds =(ev)=>{
  const { name, value } = ev.target;
   setSelectValue((props)=>({...props,[name]:value}));
}

  return (
    <>
      <Box>
        <Card className={classes.searchCard }>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>게임 정보 상세</h5>

              {/*  버튼 박스 */}
              <Box className={media.w525 ?classes.detailsBtnBox:classes.w525detailsBtnBox}>
                <Button
                className={media.w525 ? classes.button:null}
                  onClick={inputReset}
                  variant="contained"
                  color="primary"
                  disabled={ subMitFlag?.addFlag ===false ?false:true} 
                >
                  신규
                </Button>
                <Button 
                 className={media.w525 ? classes.button:null}
                 style={{marginLeft:media.w525 ? "0.5em":"0.5em"}}
                  onClick={editClick} 
                  variant="contained" 
                  color="primary" 
                  disabled={disabledHandler(subMitFlag) ?false:true}>
                  수정
                </Button>
                <Button
                 className={media.w525 ? classes.button:null}
                  style={{marginLeft:media.w525 ? "0.5em":"0.5em", backgroundColor: disabledHandler(subMitFlag) ?"#E0E0E0":"red" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={ disabledHandler(subMitFlag) ?true:false}
                >
                  저장
                </Button>
                
              </Box>
              {/*  버튼 박스 */}
            </Box>
            <CardContent className={media.w500 ? classes.inputCardContent :null} >
              {/* 디테일 인풋폼 그리드 컨테이너 */}
              <Grid container spacing={2} style={media.w500 ?{width:"50%",marginRight:"1em"}:{marginBottom:"1em"}}  >
                  <Grid item lg={12}   xs={12}>
                      <TextField
                          style={{ width: '100%' }}
                          label="게임 아이디"
                          variant="outlined"
                          name="GME_ID"
                          inputRef={register}
                          size="small"
                          InputProps={ {
                                readOnly: true,
                                startAdornment: <div></div>
                              }}
                        />
                      </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                       error={inputReadOnly?getValues("GME_NM") ==="" ?true :false:false}
                       helperText={inputReadOnly?getValues("GME_NM") ==="" ?"게임명을 입력해주세요":false:false}
                          style={{ width: '100%' }}
                          label="게임명"
                          variant="outlined"
                          name="GME_NM"
                          inputRef={register({ required: true })}
                          size="small"
                          InputProps={inputReadOnly
                            ? { startAdornment: <div></div> }
                            : {
                              readOnly: true,
                                startAdornment: <div></div>
                              }}
                        />
                  </Grid>
              <Grid item lg={12}   xs={12}>
                 <TextField
                    style={{ width: '100%' }}
                    label="게임 크레딧"
                    variant="outlined"
                    name="GME_CRD"
                    inputRef={register}
                    size="small"
                    InputProps={inputReadOnly
                      ? { startAdornment: <div></div> }
                      : {
                        readOnly: true,
                        startAdornment: <div></div>
                      }}
                  />
              </Grid>
              <Grid item lg={12}   xs={12}>
                <TextField
                      style={{ width: '100%' }}
                      label="게임 라운드"
                      variant="outlined"
                      name="GME_RND_VAL"
                      inputRef={register}
                      size="small"
                      InputProps={inputReadOnly
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                    />
               </Grid>
                <Grid item lg={12} xs={12}>
                  <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                      error={inputReadOnly?selectValue?.SVC_CD ===undefined ?true :false:false}
                    >
                      <InputLabel>서비스</InputLabel>
                      <Select
                        label="서비스"
                        name="SVC_CD"
                        onChange={onSelecteds}
                        value={selectValue?.SVC_CD ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                    
                    {svc_code?.getCode?.map(option => (
                          <MenuItem
                            key={option.COM_CD}
                            value={option.COM_CD}
                          >
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{inputReadOnly?selectValue?.SVC_CD ===undefined ?"서비스를 선택해주세요." :false:false}</FormHelperText>
                    </FormControl>
                    
                  </Grid>
               <Grid item lg={12}   xs={12}>
                    <FormControl
                        style={{width:"100%"}}
                        size="small"
                        variant="outlined"
                      >
                        <InputLabel>게임카테고리</InputLabel>
                        <Select
                          label="게임카테고리"
                          name="GME_CTG_CD"
                          onChange={onSelecteds}
                          value={selectValue?.GME_CTG_CD ||""}
                          readOnly={inputReadOnly ? false: true}
                        >
                      
                      {gme_ctg_code?.getCode?.map(option => (
                            <MenuItem
                              key={option.COM_CD}
                              value={option.COM_CD}
                            >
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                </Grid>
                <Grid item lg={12}   xs={12}>
                <FormControl
                      style={{width:"100%"}}
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel>핸디캡 적용여부</InputLabel>
                      <Select
                        label="핸디캡 적용여부"
                        name="HNDI_YN"
                        onChange={onSelecteds}
                        value={selectValue?.HNDI_YN ||""}
                        readOnly={inputReadOnly ? false: true}
                      >
                    
                    <MenuItem value={"Y"} >
                          Y
                      </MenuItem>
                      <MenuItem value={"N"} >
                          N
                      </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={12}   xs={12}>
                  <TextField
                      style={{ width: '100%' }}
                      label="게임 설명"
                      multiline
                      rows={6}
                      name="GME_DESC"
                      inputRef={register}
                      variant="outlined"
                      InputProps={inputReadOnly
                        ? { startAdornment: <div></div> }
                        : {
                            readOnly: true,
                            startAdornment: <div></div>
                          }}
                   />
                  </Grid>
             </Grid>
             <Box width={media.w490? "45%":null}>
              <GameDetailTable mcn_mdl_code={mcn_mdl_code} setMcnMdlId={setMcnMdlId} mcnId={gameDetailData?.MCN_MDL_CD_LST}/>
            </Box>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </CardContent>
        
          </form>
        </Card>
      </Box>
     
    </>
  );
}
GameDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(GameDetail);

