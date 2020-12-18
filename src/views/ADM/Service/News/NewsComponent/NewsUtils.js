  /**
 * 그리드 데이터를 클릭시 국가코드,시도코드를 문자열(001,002,003)로 받은걸 배열로 변환시켜 디테일 인풋 초기셋팅을 함
 * @param {String} NAT_CD 국가코드
 * @param {String} STT_CD 시도코드 
 */
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

    /**
 * 그리드를 리패치하기 위해 param를 넘겨 줘야하기 때문에 리패치 useQuery 실행시 기본param 
 */
  export const param = {SVC_CD_LST:"",NTC_NM:"",REG_DT:"", NAT_CD:"",STT_CD:""};

  /**
 * search컴포넌트에서 조회시 리듀서 상태를 디스패치
 * @param {Function} dispatch 리듀서를 하기위한 디스패치  
 */
  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
   
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
      dispatch({
        type: 'NTC_DETAIL_RESET',
      });
  }

  /**
 * table컴포넌트에서 그리드 테이블 데이터를 클릭시 리듀서 상태를 디스패치
 * @param {Object} ev 그리드 클릭한 해당 데이터를 받아옴.
 * @param {Function} dispatch 리듀서를 하기위한 디스패치  
 */
  export const tableSelectDispatch=(ev,dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'NTC_DETAIL',
        ntcDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      //클릭한 유저 아이디를 배열로 저장
      dispatch({
        type: 'DROP_FILE_RESET',
      });
  }
    /**
 * table컴포넌트에서 데이터 삭제시 리듀서 상태를 디스패치
 * @param {Function} dispatch 리듀서를 하기위한 디스패치  
 */
  export const tableRemoveDispatch=(dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'NTC_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
  }

    /**
 * detail 컴포넌트에서 수정,추가하여 저장시 리듀서 상태를 디스패치
 * @param {Function} reset react-hook-form 라이브러리의 메소드. 인풋값을 초기화하는 함수
 * @param {Function} dispatch 리듀서를 하기위한 디스패치
 * @param {String} id 데이터 수정후 저장시 ID를 받아 그리드 테이블을 다시 선택 포커싱할때 필요한 ID
 */
  export const detailSubmitDispatch=(reset,dispatch,id)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'NTC_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
      dispatch({
        type: 'SEL_FOCUS',
        selFocusId:id
      });
      reset();
  }

    /**
 * detail 컴포넌트에서 수정 저장시 그리드테이블에서 받아온 데이터와 수정할 데이터를 비교하는 함수
 * @param {Object} data 그리드 테이블 클릭시 받아온 데이터
 * @param {Object} formData 데이터를 수정후 저장시 백엔드로 보내는 데이터.
 */
  export const editHandler=(data,formData,dropFileData)=>{
    const detailData = {
      NTC_NM:data?.NTC_NM,
      NAT_CD_LST:data?.NAT_CD_LST,
      STT_CD_LST:data?.STT_CD_LST,
      SVC_CD_LST:data?.SVC_CD_LST,
      NTC_CONT:data?.NTC_CONT,
      NTC_ID:data?.NTC_ID,
      FIX_YN:data?.FIX_YN,
      dropFileData:0
    }
    const postFormData = {...formData,dropFileData:dropFileData.length}
  
    return JSON.stringify(detailData)===JSON.stringify(postFormData)
  }