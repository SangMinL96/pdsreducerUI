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
      DLR_ID:data?.DLR_ID,
      SHP_CTG_CD:data?.SHP_CTG_CD,
      NAT_ID:data?.NAT_ID,
      STE_ID:data?.STE_ID,
      CTY_ID:data?.CTY_ID,
      SHP_ID:data?.SHP_ID,
      SHP_NM:data?.SHP_NM,
      SHP_ADDR:data?.SHP_ADDR,
    };
    const postFormData = formData
  
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }