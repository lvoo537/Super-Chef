import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (auth) => {}
});

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        authenticated: false
    });

    const setAuthenticated = (value) => {
        setAuthState((prevState) => ({ ...prevState, authenticated: value }));
    };

    return (
        <AuthContext.Provider
            value={{
                authenticated: authState.authenticated,
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
