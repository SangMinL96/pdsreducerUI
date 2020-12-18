import { gql } from 'apollo-boost';

export const GET_MachineSttg_DATA = gql`
  query getMachineSttg($param: MachineSttgQParam, $ver: String!) {
    getMachineSttg(param: $param, ver: $ver) {
       GME_ID
       SVC_CD
       SVC_NM
       GME_CTG_CD
       GME_CTG_NM
       GME_NM
       GME_DESC
       GME_CRD
       GME_RND_VAL
       HNDI_YN
       MCN_MDL_CD_LST
      
    }
  }
`;


export const SVC_CD_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const MCN_MDL_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "MCN_MDL_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const GME_CTG_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "GME_CTG_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;



export const MachineSttg_DEL = gql`
  mutation delMachineSttg($ver: String!, $MachineSttg: MachineSttgInput) {
    delMachineSttg(ver: $ver, MachineSttg: $MachineSttg) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const MachineSttg_ADD = gql`
  mutation saveMachineSttg($ver: String!, $MachineSttg: MachineSttgInput) {
    saveMachineSttg(ver: $ver, MachineSttg: $MachineSttg) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const MachineSttg_EDIT = gql`
   mutation saveMachineSttg($ver: String!, $MachineSttg: MachineSttgInput) {
    saveMachineSttg(ver: $ver, MachineSttg: $MachineSttg) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;