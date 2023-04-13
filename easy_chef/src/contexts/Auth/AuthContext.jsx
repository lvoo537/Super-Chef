import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (auth) => {}
});

export function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem('authenticated')) || false;
    });

    useEffect(() => {
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
    }, [authenticated]);

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                setAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
