import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [orderNew, setOrderNew] = useState(null)

  return (
    <AppContext.Provider value={{orderNew, setOrderNew}}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}