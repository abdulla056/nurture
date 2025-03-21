import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import api from "../../services/api";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

const getPrediction = () => {
  const predictionId = Cookies.get("predictionId");
  return predictionId;
};

const setPrediction = (predictionId) => {
  Cookies.set("predictionId", predictionId, {
    expires: 1 / 24,
    secure: true,
    sameSite: "Strict",
  });
};


export default function Dashboard() {
  const [predictionDetails, setPredictionDetails] = useState();
  const [pastPredictions, setPastPredictions] = useState([]);
  const predictionId = getPrediction();

  useEffect(() => {
    const fetchPredictionDetails = async () => {
      try {
        const res = await api.get(`/details/get_prediction/${predictionId}`, {
          withCredentials: true,
        });
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
            `/details/get_predictions/${predictionDetails.patientId}`,
            { withCredentials: true }
          );
          setPastPredictions(res.data);
        } catch (error) {
          console.error("Error fetching past predictions:", error);
        }
      };
      fetchPastPredictions();
    }
  }, [predictionDetails]);

  const confidenceScore = predictionDetails?.confidence.toFixed(2);

  const ctxValue = {
    riskScore: predictionDetails?.riskScore,
    predictionId: predictionDetails?.predictionId,
    timeStamp: predictionDetails?.timeStamp,
    confidenceScore: confidenceScore,
    contributingFactors: predictionDetails?.explanationText,
    detailId: predictionDetails?.detailId,
    doctorId: predictionDetails?.doctorId,
    expectedOutcome: predictionDetails?.prediction,
    patientId: predictionDetails?.patientId,
    predictionResult: predictionDetails?.prediction,
    riskLevel: predictionDetails?.riskLevel,
    shapExplanation: predictionDetails?.explanationImage,
    setPrediction: setPrediction,
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
