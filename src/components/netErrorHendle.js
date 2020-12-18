import Axios from 'axios';




export const errorHendle = async netWorkError => {
  if (netWorkError === 401) {
    try {
      const token = await Axios.get(process.env.REACT_APP_API_GW_URL+'/api/v1/getToken', {
        withCredentials: true
      });
      
      sessionStorage.setItem('token', token.data.accessToken);
    } catch {
      sessionStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.reload();
    }
  } else if (netWorkError === 400) {
    sessionStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.reload();
  } else if (netWorkError === 403) {
    sessionStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.reload();
  }
};
export const netError =(ErrorName)=>{
  let netWorkError = ErrorName?.networkError?.response?.status;
  errorHendle(netWorkError);
}