import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import { loginInRoutes, loginOutRoutes } from 'src/routes';
import { ToastContainer } from 'react-toastify';
import Client from 'src/Apollo/Client';
import { ApolloProvider } from '@apollo/react-hooks';
import './components/i18n'
import Axios from 'axios';
import { CookiesProvider } from "react-cookie";
const App = () => {
  const loginInRouting = useRoutes(loginInRoutes);
  const loginOutRouting = useRoutes(loginOutRoutes);
  let loginToken = sessionStorage.getItem('token')
 
 

const refreshToken = async()=>{
  try {
    const token = await Axios.get(`${process.env.REACT_APP_API_GW_URL}/api/v1/getToken`, {
      withCredentials: true
    });
   
    if(token?.data?.accessToken !==undefined){
      sessionStorage.setItem("token",token?.data?.accessToken)
      window.location.reload();
    }
  }catch(e){

  }
}
useEffect(()=>{

  if(sessionStorage.getItem('token') === null){
    refreshToken()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[sessionStorage,refreshToken])

  return (
    <Suspense fallback="loading">    
    <ApolloProvider client={Client}>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            {loginToken === null ? loginOutRouting : null}
            {loginToken !== null ? loginInRouting : null}
            <ToastContainer position="top-center" />
        </ThemeProvider>
      </CookiesProvider>
    </ApolloProvider>
  </Suspense>
  );
};

export default App;
