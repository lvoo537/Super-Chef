import { createContext, useContext, useState } from 'react';
import fetchBackend from '../../Utils/fetchBackend';

export const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (auth) => {},
    uid: '',
    setUid: (uid) => {}
});

export function useAuthContext() {
    return useContext(AuthContext);
}
