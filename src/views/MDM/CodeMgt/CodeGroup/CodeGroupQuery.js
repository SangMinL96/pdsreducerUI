import { gql } from 'apollo-boost';

export const GET_CODE_DATA = gql`
  query getCodeGrp($param: CodeGrpQParam, $ver: String!) {
    getCodeGrp(param: $param, ver: $ver) {
      COM_CD_GRP_ID
      COM_CD_GRP_NM
      COM_CD_GRP_DESC
     
    }
  }
`;
export const CODE_GRP_ADD = gql`
  mutation saveCodeGrp($ver: String!, $codegrp: CodeGrpInput) {
    saveCodeGrp(ver: $ver, codegrp: $codegrp) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const CODE_GRP_EDIT = gql`
    mutation saveCodeGrp($ver: String!, $codegrp: CodeGrpInput) {
    saveCodeGrp(ver: $ver, codegrp: $codegrp) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const CODE_GRP_DEL = gql`
  mutation delCodeGrp($ver: String!, $codegrp: CodeGrpInput) {
    delCodeGrp(ver: $ver, codegrp: $codegrp) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;