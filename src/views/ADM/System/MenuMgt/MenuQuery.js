import { gql } from '@apollo/client';

export const GET_CODE = gql`
  query getCode($ver: String!, $COM_CD_GRP_ID: String!) {
    getCode(ver: $ver, COM_CD_GRP_ID: $COM_CD_GRP_ID) {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const GET_MENU_DATA = gql`
  query getMenu($ver: String!, $param: MenuQParam) {
    getMenu(ver: $ver, param: $param) {
      MNU_ID
      MNU_NM
      MDLE_CD
      SCRN_ID
      LVL
      UPR_MNU_ID
      SHOW_YN
      SVC_CD
      DAT_CD
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;

export const MENU_DEL = gql`
  mutation delMenu($ver: String!, $menu: MenuInput) {
    delMenu(ver: $ver, menu: $menu) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const MENU_ADD = gql`
  mutation saveMenu($ver: String!, $menu: MenuInput) {
    saveMenu(ver: $ver, menu: $menu) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const MENU_EDIT = gql`
  mutation saveMenu($ver: String!, $menu: MenuInput) {
    saveMenu(ver: $ver, menu: $menu) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;