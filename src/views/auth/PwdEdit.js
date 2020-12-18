import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import { Box, makeStyles, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
const useStyles = makeStyles(() => ({
    pwdEditContainer:{
      width:"300px",
      height:"300px",
      padding:"2.5em",
      overflow:"hidden",
      justifyContent:"center",
        alignItems:"center",
        "& h3":{
          textAlign:"center",
        },
      
     },
    pwdEditInput:{
      width: '100%',
      marginTop:"1em"
     },
     submitBtn:{
        width: '100%',
        marginTop:"1.2em"
        },
     pwdCheckErr:{
      fontSize:"0.72rem",
      marginTop:"5px",
      color:"red"

        }
  }));
 const EDIT_PWD = gql`
  mutation modifyUser($ver: String!, $user: UserInput) {
    modifyUser(ver: $ver, user: $user) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
   
function PwdEdit({setpwdEdit}){
 
    const classes = useStyles();
    const { register, handleSubmit,reset, errors } = useForm();
    const [pwdCheckErr,setPwdCheckErr] =useState(false)
    const [pwdData,setPwdData] =useState()
    const [editPwdMutation] = useMutation(EDIT_PWD, {
      variables: {
        user: pwdData,
        ver: 'v1'
      }
    });


    const onSubmit = async data => {
      setPwdData({USR_ID:data?.USR_ID,PWD:data?.PWD,UPDATE_PWD_YN:"Y"})
    if(data?.PWD === data?.PWD_CHECK){
       const result = editPwdMutation()
       result.then((data)=>{
         const editResult = data?.data?.modifyUser?.rsltCd
         if(editResult ==="OK"){
           toast.success("정상적으로 변경되었습니다.")
           setpwdEdit(false)
         }
         if(editResult ==="NG"){
           toast.error("비밀번호 변경 대상이 아닙니다.")
         }
       })
    }else{
      setPwdCheckErr(true)
    }
    };

    const onClose =()=>{
      setpwdEdit(false)
      setPwdCheckErr(false)
      reset()
    }
    
  
 return (
    <div>
 
    <Dialog open={true} onClose={onClose}  >
     
    <DialogContent className={classes.pwdEditContainer}>
      <h3>비밀번호 변경</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
            error={errors?.USR_ID !== undefined ? true : false}
            className={classes.pwdEditInput}
            label="아이디"
            variant="outlined"
            fullWidth
            type="text"
            name="USR_ID"
            inputRef={register({ required: true })}
            size="small"
          />
          <TextField
         
            error={errors?.PWD !== undefined ? true : false}
            className={classes.pwdEditInput}
            label="신규 비밀번호"
            variant="outlined"
            type="password"
            name="PWD"
            inputRef={register({ required: true })}
            size="small"
          />
            <TextField
            error={errors?.PWD_CHECK !== undefined ? true : pwdCheckErr ?true : false}
            className={classes.pwdEditInput}
            label="비밀번호 재확인"
            variant="outlined"
            type="password"
            name="PWD_CHECK"
            inputRef={register({ required: true })}
            size="small"
          />
          {pwdCheckErr? <Box className={classes.pwdCheckErr}>비밀번호가 일치하지 않습니다.</Box>:null}
         <Button
          className={classes.submitBtn}
          type="submit"
            fullWidth
            variant="contained"
            color="primary"
              size="small"
              
          >
            변경하기
          </Button>
          </form>
    </DialogContent>
     
    </Dialog>
  </div>
);
}

export default PwdEdit;