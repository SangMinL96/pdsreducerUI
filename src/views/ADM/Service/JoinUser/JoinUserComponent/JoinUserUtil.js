import Moment from 'moment'
export const tableSelectDispatch=(userId,data,dispatch)=>{
    dispatch({
        type: 'DETAIL_TABLE_DATA',
        userId
      });
      dispatch({
        type: 'USER_DETAIL',
        userDetail: data
      });
      dispatch({
        type: 'SUBMET_RESET'
     });
      dispatch({
        type: 'READ_ONLY'
      });
}

export const detailSubmitDispatch=(dispatch,id)=>{
    dispatch({
        type: 'READ_ONLY'
      });
     dispatch({
              type:'SEL_FOCUS',
              selFocusId:id
            });
            dispatch({
              type: 'SUBMET_RESET'
           });
}
export const param = {SVC_CD_LST:"",USR_TP_CD:"",USR_ID:"",USR_NM:"",HP:"",EML:"",NIC_NM:"",HME_SHP_NM:"",}
export const editHandler=(data,formData)=>{
    const detailData = {USR_ID:data?.USR_ID,PRM_CRD:data?.PRM_CRD,MBSHP_EXP_DT: Moment(data?.MBSHP_EXP_DT).format('YYYY.MM.DD'),PWD_EXP_DT:Moment(data?.PWD_EXP_DT).format('YYYY-MM-DD')}
    const postFormData = formData
    return JSON.stringify(detailData)=== JSON.stringify(postFormData)
  }