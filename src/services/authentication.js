import api from "./api";

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout', {withCredentials: true});
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}