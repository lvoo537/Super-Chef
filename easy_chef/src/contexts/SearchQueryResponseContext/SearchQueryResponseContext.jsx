import { createContext, useContext, useState } from 'react';

const SearchQueryResponseContext = createContext({
    searchQueryResponse: [],
    setSearchQueryResponse: (query) => {}
});

export function SearchQueryResponseProvider({ children }) {
    const [searchQueryResponse, setSearchQueryResponse] = useState([]);

    return (
        <SearchQueryResponseContext.Provider
            value={{ searchQueryResponse, setSearchQueryResponse }}
        >
            {children}
        </SearchQueryResponseContext.Provider>
    );
}

export function useSearchQueryResponseContext() {
    return useContext(SearchQueryResponseContext);
}
