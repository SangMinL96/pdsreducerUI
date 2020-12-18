import Axios from "axios";
import fileDownload from "js-file-download";
import { confirmAlert } from "react-confirm-alert";
import {toast } from 'react-toastify';


export const disabledHandler = (subMitFlag) => subMitFlag?.editFlag ===false && subMitFlag?.addFlag ===false
export const validate =(error,getValues)=> error !== undefined && getValues === ""
export const dataAddHandler = (result,toast,refetch,dispatch)=>{
  if(result ==="OK"){
  toast.success("정상적으로 추가되었습니다.")
  refetch()
  }else{
    toast.error("다시시도 해주세요.")
  }

}

export const dataEditHandler = (result,toast,refetch)=>{
 
  if(result ==="OK"){
  toast.success("정상적으로 수정되었습니다.")
  refetch()
  }else{
    toast.error("다시시도 해주세요.")
  }
  
}
export const dataRemoveHandler = (result,toast,refetch)=>{
      if(result==="OK"){
      toast.success("정상적으로 삭제되었습니다.")
      refetch()
      }else{
        toast.error("다시시도 해주세요.")
      }
    }
export const serviceValue = params => {
  if (params === '001') {
    return '어드민';
  } else if (params === '002') {
    return 'HIPONG';
  } else if (params === '003') {
    return 'DARTS';
  } else if (params === '001,002') {
    return '어드민,HIPONG';
  } else if (params === '001,003') {
    return '어드민,DARTS';
  } else if (params === '002,003') {
    return 'HIPONG,DARTS';
  } else if (params === '002,001') {
    return '어드민,HIPONG';
  } else if (params === '003,001') {
    return '어드민,DARTS';
  } else if (params === '003,002') {
    return 'HIPONG,DARTS';
  } else if (params === '001,002,003') {
    return '어드민,HIPONG,DARTS';
  }else if(params === "000"){
    return "공통"
  }
};



export const fileUpload = async (filesObject,noticeId,refetch)=>{
  const formPayload = new FormData()
  for(let i = 0; i < filesObject.length; i++) {
    formPayload.append('file' ,filesObject[i].file)
}
  formPayload.append('FL_OWNR_ID',noticeId )
  formPayload.append('ver','v1')
    try {
      const result = await Axios.post(
        `${process.env.REACT_APP_API_GW_URL}/api/v1/files`, formPayload,
        { withCredentials: true }
      );
      refetch()
     console.log(result)
      if(result?.data?.rsltCd ==="NG"){
      toast.error("파일 업로드 실패하였습니다.")
    }
    } catch (e) {
      console.log(e);
    }
    
}

export const download=(url, filename)=> {
  Axios.get(url, {
    responseType: 'blob',
  }).then(res => {
    fileDownload(res.data, filename);
  });
}
export const fileRemove =(ev,fileChips,setFileChips,refetch,dispatch,id)=>{
  const fileId = ev.target.ownerDocument.activeElement.id
  confirmAlert({
    title: '삭제',
    message: '정말 삭제 하시겠습니까?',
    buttons: [
      {
        label: '네',
        onClick: async () => {
          try {
            const result = await Axios.delete(
              `${process.env.REACT_APP_API_GW_URL}/api/v1/files?ver=v1`, {params:{
                FL_IDS:[fileId]
              }}
            );
           
            if(result.data.rsltCd === "OK"){
              const removeFile = fileChips?.filter((file)=> file !== fileId);
              setFileChips(removeFile)
              toast.success("정상적으로 삭제 되었습니다.")
              dispatch({
                type: 'SUBMET_RESET'
              });
              dispatch({
                type: 'SEL_FOCUS',
                selFocusId:id
              });
            }else{
              toast.success("다시 시도해주세요.")
            }
          } catch (e) {
            console.log(e.error);
          }
          refetch()
        }
      },
      {
        label: '아니요'
      }
    ]
  });
  
}
export const fileload=async(ev)=>{
  const fileId = ev.currentTarget.id
  const fileName =ev.target.innerText
  try {
    const result = await Axios.get(
      `${process.env.REACT_APP_API_GW_URL}/api/v1/files/${fileId}?ver=v1`,
      { withCredentials: true }
    );
    
    if(result?.config?.url !==undefined){
      const fileUrl = result?.config?.url
      download(fileUrl,fileName)
    }
    console.log(result)
  } catch (e) {
    console.log(e);
  }
  }

  export const onFileAdd = (file,dispatch,dropFileData)=>{
    let dropFile = [];
    for(let i = 0; i < file.length; i++) {
      dropFile.push({...file[i],id:dropFileData.length + file[i].data})
  }
  dispatch({
    type: 'DROP_FILE',
    dropFileAdd:dropFile
  }
  )
  }