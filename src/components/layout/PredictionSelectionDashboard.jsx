import { Outlet } from "react-router-dom";
import PredictionDashboardNavBar from "../predictions-dashboard/PredictionDashboardNavBar";
import Cookies from "js-cookie";
import { PredictionSelectorContext } from "../../store/prediction-selector-context";

const setPrediction = (predictionId) => {
  Cookies.set("predictionId", predictionId, {
    expires: 1 / 24,
    secure: true,
    sameSite: "Strict",
  });
  console.log("Prediction set!");
};

const getPrediction = () => {
  const predictionId = Cookies.get("predictionId");
  console.log(predictionId);
};

const resetPrediction = () => {
  Cookies.remove("predictionId");
  console.log("Prediction reset");
};

export default function PredictionSelectionDashboard() {
  const ctxValue = {
    predictionId: "",
    setPrediction: setPrediction,
    getPrediction: getPrediction,
    resetPrediction: resetPrediction,
  };
  return (
    <PredictionSelectorContext.Provider value={ctxValue}>
      <div className="flex flex-col py-2 px-20 gap-6 relative">
        <PredictionDashboardNavBar />
        <Outlet />
      </div>
    </PredictionSelectorContext.Provider>
  );
}
