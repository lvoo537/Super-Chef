import { createContext, useContext, useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';

export const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (auth) => {},
    uid: '',
    setUid: (uid) => {}
});

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [uid, setUid] = useState('');

    fetchBackend.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );

    const value = {
        authenticated,
        setAuthenticated,
        uid,
        setUid
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
    return useContext(AuthContext);
}
