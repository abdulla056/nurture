import { createContext } from "react";

export const UserDetailsContext = createContext({
    setSignIn: () => {},
    user_id: null,
    token: null,
    setToken: (token) => {},
})