
  /**
 * search컴포넌트에서 조회시 리듀서 상태를 디스패치
 * @param {Function} dispatch 리듀서를 하기위한 디스패치  
 */
  export const initGrid = (dispatch)=>{
      dispatch({ //조회시 그리드 셀 선택을 초기화.
          type: 'SEL_CLEAR'
      });
      setTimeout( //셀 선택 초기화 재사용을 위해 리듀서 selClear값을 false로 돌려놓음
        dispatch({
          type: 'SEL_CLEAR_FALSE'
        }),
        300
      );
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'MENU_DETAIL_RESET',
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
        type: 'MENU_DETAIL',
        menuDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      //클릭한 유저 아이디를 배열로 저장
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
        type: 'MENU_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
  }

    /**
 * detail 컴포넌트에서 수정,추가하여 저장시 리듀서 상태를 디스패치
 * @param {Function} reset react-hook-form 라이브러리의 메소드. 인풋값을 초기화하는 함수
 * @param {Function} dispatch 리듀서를 하기위한 디스패치
 * @param {String} id 데이터 수정후 저장시 ID를 받아 그리드 테이블을 다시 선택 포커싱할때 필요한 ID
 */
  export const initDetail =(reset,dispatch,id)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'MENU_DETAIL_RESET',
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