import { gql } from 'apollo-boost';

export const GET_CODE_DATA = gql`
  query getCode($COM_CD_GRP_ID: String!, $ver: String!) {
    getCode(COM_CD_GRP_ID: $COM_CD_GRP_ID, ver: $ver) {
      COM_CD_GRP_ID
      COM_CD
      COM_CD_NM
      COM_CD_DESC
      COM_CD_VAL
      COM_CD_SEQ
      UPR_COM_CD
    }
  }
`;
export const CODE_ADD = gql`
  mutation saveCode($ver: String!, $code: CodeInput) {
    saveCode(ver: $ver, code: $code) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const CODE_EDIT = gql`
 mutation saveCode($ver: String!, $code: CodeInput) {
    saveCode(ver: $ver, code: $code) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const CODE_DEL = gql`
  mutation delCode($ver: String!, $code: CodeInput) {
    delCode(ver: $ver, code: $code) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;