import { createContext, useState, useEffect } from "react";

const INITIAL_STATE = {
  city: "",
  date: [],
  price:0,
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

export const SearchContextProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem("searchState");
    return savedState ? JSON.parse(savedState) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem("searchState", JSON.stringify(state));
  }, [state]);

  const setSearch = (newSearch) => {
    setState(newSearch);
  };

  const resetSearch = () => {
    setState(INITIAL_STATE);
  };

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        date: state.date,
        options: state.options,
        price: state.price,
        setSearch,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};