import React, { createContext } from "react";

export const SearchMovieContextData = createContext();

const SearchMovieContext = ({ children }) => {
    return <div>
        <SearchMovieContextData.Provider value={'sujoy'}>
            {children}
        </SearchMovieContextData.Provider>
    </div>;
};

export default SearchMovieContext;
