
  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
  
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'CITY_DETAIL_RESET',
      });

  }
  export const tableSelectDispatch=(ev,dispatch,globalDispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'CITY_DETAIL',
        cityDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      globalDispatch({
        type: "COUNTY_URP_ID",
        countyUrpId:ev.data.AREA_ID
      })
      //클릭한 유저 아이디를 배열로 저장
  }
  export const tableRemoveDispatch=(dispatch,globalDispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'CITY_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
      globalDispatch({
        type: "COUNTY_RESET",
         boolean:true
      })
    
  }

  export const detailSubmitDispatch=(dispatch,globalDispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'CITY_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
 
      globalDispatch({
        type: "COUNTY_RESET",
         boolean:true
      })
  }


  export const editHandler=(data,formData,cityUrp)=>{
    const detailData = {
      AREA_ID:data?.AREA_ID,
      AREA_NM:data?.AREA_NM,
      AREA_TP_CD:"002",
      Urp_AREA_ID:cityUrp,
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }