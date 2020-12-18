
  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
 
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'CODE_GRP_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch,setGrpId)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'CODE_GRP_DETAIL',
        codeGrpDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      setGrpId(ev.data.COM_CD_GRP_ID)
      //클릭한 유저 아이디를 배열로 저장
    
  }
  export const tableRemoveDispatch=(dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'CODE_GRP_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
    
  }



  export const detailSubmitDispatch=(reset,dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'CODE_GRP_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
     
      reset();
  }


  export const editHandler=(data,formData)=>{
    const detailData = {
      COM_CD_GRP_ID:data?.COM_CD_GRP_ID,
      COM_CD_GRP_NM:data?.COM_CD_GRP_NM,
      COM_CD_GRP_DESC:data?.COM_CD_GRP_DESC,
    
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }