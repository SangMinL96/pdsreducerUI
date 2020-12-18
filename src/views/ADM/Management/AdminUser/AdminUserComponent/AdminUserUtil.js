export const param ={USR_TP_CD:"",USR_ID:"",USR_NM:"",}
export const detailSubmitDispatch =(dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
         type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'USER_DETAIL_RESET'
      });
   
}

export const editHandler=(data,formData)=>{
  const detailData = {USR_ID:data?.USR_ID,USR_NM:data?.USR_NM,BLN_NM:data?.BLN_NM,HP:data?.HP,EML:data?.EML,USR_TP_CD:data?.USR_TP_CD}
  const postFormData = formData
  return JSON.stringify(detailData) === JSON.stringify(postFormData)
}