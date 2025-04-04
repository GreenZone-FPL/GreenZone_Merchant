import React, { useEffect, createContext, useContext, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';
import { authReducer, authInitialState, AuthActionTypes } from '../reducers/authReducer';

export const AppContext = createContext();

export let globalAuthDispatch = null;
export const AppContextProvider = ({ children }) => {


  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const [orderNew, setOrderNew] = useState(null)


  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await AppAsyncStorage.isTokenValid();
      console.log('isvalid', isValid)
      if (isValid) {
        authDispatch({ type: AuthActionTypes.LOGIN })
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    globalAuthDispatch = authDispatch;

    return () => { globalAuthDispatch = null; };
  }, [authState]);
  return (
    <AppContext.Provider value={{ authState, authDispatch, orderNew, setOrderNew }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}