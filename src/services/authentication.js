import api from "./api";
import { useContext } from "react";
import { UserDetailsContext } from "../store/user-details-context";

export const logout = async () => {
    // const { isAuthenticated, setIsAuthenticated, checkAuthCookie} = useContext(UserDetailsContext);
    try {
        const response = await api.post('/auth/logout', {} ,{withCredentials: true});
        // setIsAuthenticated(false);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}