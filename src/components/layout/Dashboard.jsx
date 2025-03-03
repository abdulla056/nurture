import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import api from "../../services/api";
import { useEffect, useState } from "react";

const predictionId = "PR001";

export default function Dashboard() {
  const [predictionDetails, setPredictionDetails] = useState();
  const [pastPredictions, setPastPredictions] = useState([]);
  useEffect(() => {
    const fetchPredictionDetails = async () => {
      try {
        const res = await api.get(`/details/get_prediction/${predictionId}`);
        setPredictionDetails(res.data);
      } catch (error) {
        console.error("Error fetching prediction details:", error);
      }
    };
    fetchPredictionDetails();
  }, []);
  useEffect(() => {
    if (predictionDetails?.patientId) {
      const fetchPastPredictions = async () => {
        try {
          const res = await api.get(
            `/details/get_predictions/${predictionDetails.patientId}`
          );
          setPastPredictions(res.data);
        } catch (error) {
          console.error("Error fetching past predictions:", error);
        }
      };
      fetchPastPredictions();
    }
  }, [predictionDetails]);

  const ctxValue = {
    riskScore: predictionDetails?.riskScore,
    predictionId: predictionDetails?.predictionId,
    timeStamp: predictionDetails?.timeStamp,
    confidenceScore: predictionDetails?.confidenceScore,
    contributingFactors: predictionDetails?.contributingFactors,
    detailId: predictionDetails?.detailId,
    doctorId: predictionDetails?.doctorId,
    expectedOutcome: predictionDetails?.expectedOutcome,
    patientId: predictionDetails?.patientId,
    predictionResult: predictionDetails?.predictionResult,
    riskLevel: predictionDetails?.riskLevel,
    pastPredictions: pastPredictions,
  };

  return (
    <PredictionDetailsContext.Provider value={ctxValue}>
      <div className="px-12 py-4 relative">
        <NavBar />
        <Outlet />
      </div>
    </PredictionDetailsContext.Provider>
  );
}
