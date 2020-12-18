import { gql } from 'apollo-boost';

export const GET_GAME_DATA = gql`
  query getGame($param: GameQParam, $ver: String!) {
    getGame(param: $param, ver: $ver) {
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



export const GAME_DEL = gql`
  mutation delGame($ver: String!, $game: GameInput) {
    delGame(ver: $ver, game: $game) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const GAME_ADD = gql`
  mutation saveGame($ver: String!, $game: GameInput) {
    saveGame(ver: $ver, game: $game) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const GAME_EDIT = gql`
   mutation saveGame($ver: String!, $game: GameInput) {
    saveGame(ver: $ver, game: $game) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;