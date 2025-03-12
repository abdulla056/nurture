import { createContext } from "react";

export const UserDetailsContext = createContext({
    // setSignIn: () => {},
    token: null,
    isAuthenticated: null,
    setIsAuthenticated: () => {},  
    setToken: (token) => {},
    deleteCookie: () => {},
    getCookie: () => {},
})