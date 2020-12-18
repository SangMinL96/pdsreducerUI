export const param ={MDLE_CD:"",API_ID:"",API_NM:"",}
export const detailSubmitDispatch =(dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
         type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'API_DETAIL_RESET'
      });
   
}

export const editHandler=(data,formData)=>{
  const detailData = {
    API_ID:data?.API_ID,
    API_NM:data?.API_NM,
    API_VER:data?.API_VER,
    API_EPT_PTH:data?.API_EPT_PTH,
    FUNC_CD:data?.FUNC_CD,
    API_DESC:data?.API_DESC,
    MDLE_CD:data?.MDLE_CD,
  }
  const postFormData = formData
  return JSON.stringify(detailData)===JSON.stringify(postFormData)
}