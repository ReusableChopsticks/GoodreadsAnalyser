import { createContext, ReactNode, useState } from "react";

const DATA_KEY = 'data'

type DataContextType = {
  setData: (data: Object[]) => void;
  getData: () => Object[];
  clearData: () => void;
}

const setData = (data: Object[]): void => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}
const getData = (): Object[] => {
  const data = localStorage.getItem(DATA_KEY);
  if (data) {return JSON.parse(data)} else {return []}
}
const clearData = (): void => {
  localStorage.setItem(DATA_KEY, '[]');
}
const contextValue: DataContextType = {
  setData,
  getData,
  clearData,
}

const DataContext = createContext<DataContextType>(contextValue);

const DataContextProvider = ({children}: {children: ReactNode}) => {
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
}

export {
  DataContextProvider,
  DataContext
}