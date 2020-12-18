import { gql } from 'apollo-boost';

export const GET_SCRN = gql`
  query getScreen($param: ScreenQParam, $ver: String!) {
    getScreen(param: $param, ver: $ver) {
      SCRN_ID
      SCRN_NM
      SVC_CD
      SVC_NM
      SCRN_LNK_PTH
      SCRN_DESC
      }
  }
`;

export const SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const EDI_SCRN = gql`
  mutation saveScreen($ver: String!, $screen: ScreenInput) {
    saveScreen(ver: $ver, screen: $screen) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const ADD_SCRN = gql`
  mutation saveScreen($ver: String!, $screen: ScreenInput) {
    saveScreen(ver: $ver, screen: $screen) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_SCRN = gql`
  mutation delScreen($ver: String!, $screen: ScreenInput) {
    delScreen(ver: $ver, screen: $screen) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const GET_SCREEN_API = gql`
  query getScreenApi($scrnId: String!, $ver: String!) {
    getScreenApi(SCRN_ID: $scrnId, ver: $ver) {
        API_ID
        API_NM
        API_DESC  
        API_VER
        MDLE_CD
        MDLE_NM
        API_EPT_PTH
        FUNC_CD
      }
  }
`;

export const GET_API = gql`
  query getApi($param: ApiQParam, $ver: String!) {
    getApi(param: $param, ver: $ver) {
        API_ID
        API_NM
        API_DESC
        API_VER
        MDLE_CD
        MDLE_NM
        API_EPT_PTH
        FUNC_CD
      }
  }
`;


export const SAVE_SCRN_API = gql`
  mutation saveScreenApi($ver: String!, $screenapi: ScreenApiInput) {
    saveScreenApi(ver: $ver, screenapi: $screenapi) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
