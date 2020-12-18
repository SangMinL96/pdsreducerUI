

  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
  
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'AREA_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch,globalDispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'AREA_DETAIL',
        areaDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'READ_ONLY'
      });
      globalDispatch({
        type: 'CITY_URP_ID',
        cityUrpId:ev.data.AREA_ID
      });
      //클릭한 유저 아이디를 배열로 저장
    
  }
  export const tableRemoveDispatch=(dispatch,globalDispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'AREA_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
      globalDispatch({
        type: "CITY_RESET",
        boolean:true
      })
      globalDispatch({
        type: "COUNTY_RESET",
         boolean:true
      })
  }



  export const detailSubmitDispatch=(reset,dispatch,globalDispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'AREA_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
      globalDispatch({
        type: "CITY_RESET",
        boolean:true
      })
       globalDispatch({
        type: "COUNTY_RESET",
         boolean:true
      })
      reset();
  }


  export const editHandler=(data,formData)=>{
    const detailData = {
      AREA_ID:data?.AREA_ID,
      AREA_NM:data?.AREA_NM,
      CTNT_CD:data?.CTNT_CD,
      AREA_TP_CD:"001",
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }