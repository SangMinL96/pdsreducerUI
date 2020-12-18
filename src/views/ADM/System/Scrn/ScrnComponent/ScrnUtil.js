export const param ={SVC_CD:"",SCRN_NM:"",}
export const detailSubmitDispatch =(dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
         type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'SCRN_DETAIL_RESET'
      });
   
}

export const editHandler=(data,formData)=>{
  const detailData = {
    SCRN_ID:data?.SCRN_ID,
    SCRN_NM:data?.SCRN_NM,
    SCRN_DESC:data?.SCRN_DESC,
    SCRN_LNK_PTH:data?.SCRN_LNK_PTH,
    SVC_CD:data?.SVC_CD
  }
  const postFormData = formData
  return JSON.stringify(detailData) === JSON.stringify(postFormData)
}