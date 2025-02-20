import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import api from "../../services/api";
import { useEffect, useState } from "react";

const predictionId = "PR001";

export default function Dashboard() {
  const [predictionDetails, setPredictionDetails] = useState();
  useEffect(() => {
    const fetchPredictionDetails = async () => {
      try {
        const res = await api.get(`/prediction/get_prediction/${predictionId}`);
        setPredictionDetails(res.data);
      } catch (error) {
        console.error("Error fetching prediction details:", error);
      }
    };
    fetchPredictionDetails();
  }, []);

  return (
    <PredictionDetailsContext.Provider value={predictionDetails}>
      <div className="px-12 py-4 relative">
        <NavBar />
        <Outlet />
      </div>
    </PredictionDetailsContext.Provider>
  );
}
