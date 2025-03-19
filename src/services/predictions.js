import api from "./api";

export const predictAndExplain = async (category, features, keyValue, patientId, detailId) => {
  try {
    const response = await api.post("/supervised/predict_and_explain", {
      category,
      features,
      keyValue,
      patientId,
      detailId,
    },
    {withCredentials: true}
    );

    return response.data; // Returns prediction result
  } catch (error) {
    console.error("Error calling predict_and_explain API:", error);
    throw error;
  }
};

export const deletePrediction = async (predictionId) => {
  try {
    const response = await api.delete(
      "/details/delete_prediction",
      { predictionId: predictionId },
      { withCredentials: true }
    );
    return response.data; // Returns prediction result
  }
  catch (error) {
    console.error("Error calling delete prediction API:", error);
    throw error;
  }
}
