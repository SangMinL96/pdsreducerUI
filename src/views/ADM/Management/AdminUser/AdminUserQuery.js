import { gql } from 'apollo-boost';

export const ADMIN_USER = gql`
  query getUser($param: UserQParam, $ver: String!) {
    getUser(param: $param, ver: $ver) {
      USR_ID
      USR_NM
      PWD_EXP_DT
      EML
      HP
      USR_TP_CD
      USR_TP_NM
      BLN_NM
    }
  }
`;

export const USR_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "USR_TP_CD", ver: "v1") {
      COM_CD_GRP_ID
      COM_CD
      COM_CD_NM
      COM_CD_DESC
      COM_CD_VAL
      COM_CD_SEQ
    }
  }
`;
export const EDI_USER = gql`
  mutation modifyUser($ver: String!, $user: UserInput) {
    modifyUser(ver: $ver, user: $user) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($ver: String!, $user: UserInput) {
    addUser(ver: $ver, user: $user) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_USER = gql`
  mutation delUser($ver: String!, $user: UserInput) {
    delUser(ver: $ver, user: $user) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
