import api from "./api";

export const predictAndExplain = async (category, features) => {
  try {
    const response = await api.post("/supervised/predict_and_explain", {
      category,
      features,
    });

    return response.data; // Returns prediction result
  } catch (error) {
    console.error("Error calling predict_and_explain API:", error);
    throw error;
  }
};
