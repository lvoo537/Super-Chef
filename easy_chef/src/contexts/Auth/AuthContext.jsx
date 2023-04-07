import { createContext, useContext } from 'react';

export const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (auth) => {},
    uid: '',
    setUid: (uid) => {}
});

export function useAuthContext() {
    return useContext(AuthContext);
}
