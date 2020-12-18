import React, { useReducer, createContext, useContext } from 'react';

const AreaGlobalState = {
  city_urp_id: undefined,
  county_urp_id : undefined,
  cityReset:false,
  countyReset:false
 
};


function Reducer(state, action) {
  switch (action.type) {
    case 'CITY_URP_ID': //search 컴포넌트에서 데이터를 받아 디스패치후 useReducer 기본 state에 데이터를 넣음
      return { ...state, city_urp_id: action?.cityUrpId };
    case 'COUNTY_URP_ID': //search 컴포넌트에서 데이터를 받아 디스패치후 useReducer 기본 state에 데이터를 넣음
      return { ...state, county_urp_id: action?.countyUrpId };
      case 'CITY_RESET': //search 컴포넌트에서 데이터를 받아 디스패치후 useReducer 기본 state에 데이터를 넣음
      return { ...state, cityReset: action?.boolean };
      case 'COUNTY_RESET': //search 컴포넌트에서 데이터를 받아 디스패치후 useReducer 기본 state에 데이터를 넣음
      return { ...state, countyReset: action?.boolean };
   
    default:
      throw new Error('Error');
  }

}

const StateContext = createContext();
const DispatchContext = createContext();

export function AreaGlobalContext({ children }) {
  const [state, dispatch] = useReducer(Reducer, AreaGlobalState);

  return (
    <StateContext.Provider
      value={{
        city_urp_id: state?.city_urp_id,
        county_urp_id:state?.county_urp_id,
        cityReset:state?.cityReset,
        countyReset:state?.countyReset,
      }}
    >
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(StateContext);
}
export function useGlobalDispatch() {
  return useContext(DispatchContext);
}
