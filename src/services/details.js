import api from "./api";

export const storeDetails = async (details) => {
  try {
    const response = await api.post(
      "/details/add_details",
      details,
      { withCredentials: true }
    );

    return response.data; // Returns prediction result
  } catch (error) {
    console.error("Error adding details", error);
    throw error;
  }
};
