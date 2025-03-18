import api from "./api";

export const predictAndExplain = async (category, features, patientId, detailId) => {
  try {
    const response = await api.post("/supervised/predict_and_explain", {
      category,
      features,
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
      {
        data: { predictionId: predictionId }, // Payload goes here
        withCredentials: true, // Credentials option
      }
    );
    return response.data; // Returns prediction result
  }
  catch (error) {
    console.error("Error calling delete prediction API:", error);
    throw error;
  }
}

export const deletePatient = async (patientId) => {
  try {
    const response = await api.delete(
      "/patient/delete", {
        data: { patientId: patientId }, // Payload goes here
        withCredentials: true, // Credentials option
      }
    );
    return response.data; // Returns prediction result
  }
  catch (error) {
    console.error("Error calling delete patient API:", error);
    throw error;
  }
}
