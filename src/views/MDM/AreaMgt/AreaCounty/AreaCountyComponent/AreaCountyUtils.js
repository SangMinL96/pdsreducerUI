
  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
 
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'COUNTY_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'COUNTY_DETAIL',
        countyDetail: ev.data
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
        type: 'COUNTY_DETAIL_RESET'
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
        type: 'COUNTY_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
   
  }


  export const editHandler=(data,formData,countyUpr)=>{
    const detailData = {
      AREA_ID:data?.AREA_ID,
      AREA_NM:data?.AREA_NM,
      AREA_TP_CD:"003",
      UPR_AREA_ID:countyUpr,
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }