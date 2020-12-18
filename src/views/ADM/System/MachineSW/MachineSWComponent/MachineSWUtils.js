
export const treeHandle = (NAT_CD,STT_CD)=>{
    if (NAT_CD === null) {
      return [NAT_CD].concat(STT_CD.split(','));
    } else if (STT_CD === null) {
      return NAT_CD.split(',').concat([STT_CD]);
    } else if (STT_CD === null && NAT_CD===null) {
      return [NAT_CD].concat([STT_CD]);
    } else  {
     return NAT_CD.split(',').concat(STT_CD.split(','));
    }
  }
  export const param = {SVC_CD:""};

  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
    
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
     
      dispatch({
        type: 'SVN_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'SVN_DETAIL',
        svnDetail: ev.data
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
        type: 'SVN_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
    
  }



  export const detailSubmitDispatch=(reset,dispatch,id)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'SVN_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'SEL_FOCUS',
        selFocusId:id
      });
      reset();
  }


  export const editHandler=(data,formData)=>{
    const detailData = {
      MCN_SW_REPO_NM:data?.MCN_SW_REPO_NM,
      SVN_PTH:data?.SVN_PTH,
      SVN_ID:data?.SVN_ID,
      SVN_PWD:data?.SVN_PWD,
      SW_DESC:data?.SW_DESC,
      SVC_CD:data?.SVC_CD,
      SW_TP_CD:data?.SW_TP_CD,
      MCN_SW_REPO_ID:data?.MCN_SW_REPO_ID,
      }
    const postFormData = formData
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }