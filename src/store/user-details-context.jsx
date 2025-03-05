import { createContext } from "react";

export const UserDetailsContext = createContext({
    setSignIn: () => {},
    user_id: null,
    setCookie: () => {},
    getCookie: () => {},
    deleteCookie: () => {},
})