import { gql } from 'apollo-boost';

export const GET_AREA_DATA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
       AREA_ID
       AREA_NM
       AREA_TP_CD
       UPR_AREA_ID
       CTNT_CD
       CTNT_NM
       REG_DT
    }
  }
`;
export const AREA_ADD = gql`
  mutation saveArea($ver: String!, $area: AreaInput) {
    saveArea(ver: $ver, area: $area) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const AREA_EDIT = gql`
  mutation saveArea($ver: String!, $area: AreaInput) {
    saveArea(ver: $ver, area: $area) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const AREA_DEL = gql`
  mutation delArea($ver: String!, $area: AreaInput) {
    delArea(ver: $ver, area: $area) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const GET_CTNT_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "CTNT_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;