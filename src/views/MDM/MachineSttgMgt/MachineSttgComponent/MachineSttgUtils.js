export const areaVariables = (AREA_TP_CD,urpId)=> ({ 
  returnPartialData: true,
  skip: urpId === '' ||  urpId === undefined,
  variables: {
    param: {
      AREA_TP_CD,
      UPR_AREA_ID: urpId
    },
    ver: 'v1'
  }
})

export const variables =(param)=>({ // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
  returnPartialData: true,
  fetchPolicy: 'network-only',
  notifyOnNetworkStatusChange: true,
  variables: {
    param,
    ver: 'v1'
  }
})



    /**
 * detail 컴포넌트에서 수정 저장시 그리드테이블에서 받아온 데이터와 수정할 데이터를 비교하는 함수
 * @param {Object} data 그리드 테이블 클릭시 받아온 데이터
 * @param {Object} formData 데이터를 수정후 저장시 백엔드로 보내는 데이터.
 */
  export const editHandler=(data,formData)=>{
    const detailData = {
      GME_ID:data?.GME_ID,
      GME_NM:data?.GME_NM,
      GME_CRD:data?.GME_CRD===null? "":data?.GME_CRD,
      GME_RND_VAL:data?.GME_RND_VAL ===null? "":data?.GME_RND_VAL  ,
      GME_DESC:data?.GME_DESC===null? "":data?.GME_DESC,
      SVC_CD:data?.SVC_CD,
      GME_CTG_CD:data?.GME_CTG_CD,
      HNDI_YN:data?.HNDI_YN,
      MCN_MDL_CD_LST:data?.MCN_MDL_CD_LST===null? "":data?.MCN_MDL_CD_LST
    };
    const postFormData = formData
  
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }