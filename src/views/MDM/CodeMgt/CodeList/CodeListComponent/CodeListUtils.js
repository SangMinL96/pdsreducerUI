
  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
   
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'CODE_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'CODE_DETAIL',
        codeDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      //클릭한 유저 아이디를 배열로 저장
  }
  export const tableRemoveDispatch=(dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'CODE_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
    
  }



  export const detailSubmitDispatch=(dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'CODE_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
   
  }


  export const editHandler=(data,formData)=>{
    const detailData = {
      COM_CD:data?.COM_CD,
      COM_CD_NM:data?.COM_CD_NM,
      COM_CD_VAL:data?.COM_CD_VAL === null ?"": data?.COM_CD_VAL,
      UPR_COM_CD:data?.UPR_COM_CD === null ?"": data?.UPR_COM_CD,
      COM_CD_SEQ:data?.COM_CD_SEQ === null ?0: data?.COM_CD_SEQ,
      COM_CD_DESC:data?.COM_CD_DESC === null ?"": data?.COM_CD_DESC,
      COM_CD_GRP_ID:data?.COM_CD_GRP_ID,
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }
  