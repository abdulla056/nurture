import api from "./api";

export const addRecommendation = async (recommendation) => {
    try {
        const response = await api.post("/feedback/add", recommendation, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error("Error storing recommendation:", error);
        throw error;
    }
}
