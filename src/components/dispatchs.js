export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });

      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'DETAIL_RESET',
      });
  }

export const addClickDispatch = (dispatch,reset)=>{
    dispatch({ //인풋 쓰기전용 적용
        type: 'READ_ONLY_FALSE'
      }); 
      dispatch({ // 저장시 신규 submit실행
        type: 'ADD_SUBMET'
      });
      dispatch({ //디테일 인풋값 리셋
        type: 'DETAIL_RESET',
      });
      reset()
}

export const editClickDispatch=(dispatch,editId,toast)=>{
    if (editId!== undefined) {
        dispatch({ //인풋 쓰기전용 적용
          type: 'READ_ONLY_FALSE'
        }); 
        dispatch({ // 저장시 수정 submit실행
          type: 'EDIT_SUBMET'
        });
      } else {
        toast.error(`수정을 원하는 공지사항을 클릭해주세요.`);  
      }
}

export const detailSubmitDispatch=(reset,dispatch)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
      reset();
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
        type: 'DETAIL_DATA',
        detailData: ev.data
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
        type: 'DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
  }

  export const selFocusDispatch =(dispatch,data)=>{
    dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
        type: 'DETAIL_DATA',
        detailData: data
      });
      dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
        type: 'SEL_FOCUS_RESET',
      });
  }