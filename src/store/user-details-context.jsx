import { createContext } from "react";

export const UserDetailsContext = createContext({
    // setSignIn: () => {},
    token: null,
    setToken: (token) => {},
    deleteCookie: () => {},
    getCookie: () => {},
})