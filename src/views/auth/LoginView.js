import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, Box } from '@material-ui/core';
import useAxiosGet from 'src/components/useAxiosGet';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import NoticeList from './NoticeList';
import Axios from 'axios';
import PwdEdit from './PwdEdit';
import { toast } from 'react-toastify';
const LoginView = () => {
  const [state] = useAxiosGet(`${process.env.REACT_APP_API_GW_URL}/api/v1/notices`);
  const { data } = state;
  const [pwdEdit,setpwdEdit]=useState(false)
  const navigate = useNavigate();
  const { register, handleSubmit, errors,setValue } = useForm();
  const [loginError,setLoginError]=useState(false)

  const onSubmit = async data => {
    try {
      const token = await Axios.post(
        `${process.env.REACT_APP_API_GW_URL}/api/v1/login`,
        data,
        { withCredentials: true }
      );
      console.log(token)
      if (token !== '' && token !== undefined) {
        sessionStorage.setItem('token',token.data.accessToken);
        localStorage.setItem('userInfo',JSON.stringify({
          loginID:token.data.user.id,
          loginDT:new Date(),
        }) );
        navigate('/', { replace: true });
      }
    } catch (error) {
      const status = error?.response?.request?.status
      const pwdEditStatus = error?.response?.data?.user
      if(pwdEditStatus ==="PWD_INIT"){
        toast.error("관리자로 인해 비밀번호가 초기화 되었습니다.")
        setpwdEdit(true)
      }
      if(status ===400){
        setLoginError(true)
      }
    }
  };
  useEffect(()=>{
   
    
    if(loginError){
    setValue("pwd","")
    
  }
  },[loginError,setValue])
  return (
    <>
    <LoginContainer>
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <LoginLogo src="/static/images/hipongLogo.png" />
          <TextField
            error={errors?.id !== undefined ? true : false}
            style={{ width: '70%' }}
            label="아이디"
            variant="outlined"
            fullWidth
            type="text"
            name="id"
            inputRef={register({ required: true })}
            size="small"
          />
          <TextField
         
            error={errors?.pwd !== undefined ? true :loginError?true: false}
            style={{ marginTop: '1em', width: '70%' }}
            label="비밀번호"
            variant="outlined"
            type="password"
            name="pwd"
            inputRef={register({ required: true })}
            size="small"
          />
          {loginError ? <LoginErrorText>아이디 또는 비밀번호가 잘못되었습니다.</LoginErrorText>:null}
          <Box   style={{ marginTop: '1em', width: '70%',display:"flex",justifyContent:"space-between" }}>
          <Button
           style={{ width: '48%' }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
              size="small"
          >
            로그인
          </Button>
          <Button
            style={{ width: '48%' }}
            fullWidth
            variant="contained"
            color="primary"
              size="small"
              onClick={()=>setpwdEdit(true)}
          >
            비밀번호변경
          </Button>
          </Box>
        </Form>
       
        <NoticeContainer>
          <h3>공지사항</h3>
          <NoticeContents>
            {data?.map(item => (
              <NoticeList
                key={item.NTC_ID}
                title={item.NTC_NM}
                dates={item.REG_DT}
              />
            ))}
          </NoticeContents>
        </NoticeContainer>
      </FormContainer>
    </LoginContainer>
     {pwdEdit? <PwdEdit setpwdEdit={setpwdEdit}/> :null}
     </>
  );
};
export default LoginView;
// 스타일스 컴포넌트
const LoginContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/static/images/loginMainImg.png");
  background-size: 100% 100%;
  top: 0px;
`;
const FormContainer = styled.div`
  width: 800px;
  height: 40vh;
  border: 1px solid #E3E5E7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4em;
  box-shadow: 0px 1px 7px 0px rgba(156, 156, 156, 0.55);
  border-radius: 8px;
  background-color: #f0f0f0f5;
  @media only screen and (max-width: 800px) {
    flex-direction: column;
    height: 85vh;
    margin: 1em;
  }
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    width: 100px;
    height: 30px;
    position: absolute;
    top: -12px;
    left: 5%;
    z-index: 10;
    border-radius: 20px;
    background-color: #f0f0f0f5;
  }
`;
const NoticeContainer = styled.div`
  position: relative;
  width: 120%;
  height: 215px;
  border-radius: 8px;
  border: 1px solid #BBBDBF;
  box-shadow: 0px 1px 4px 0px rgba(156, 156, 156, 0.55);
  @media only screen and (max-width: 800px) {
    margin-top: 2em;
    padding-bottom: 1em;
  }
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 800px) {
    align-items: center;
  }
`;
const NoticeContents = styled.div`
  margin-top: 1em;
  width: 100%;
  height: 92%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const LoginLogo = styled.img`
  width: 75%;
  margin-bottom:1em;
`;
const LoginErrorText =styled.div`
width:70%;
font-size:0.72rem;
margin-top:5px;
color:red
`