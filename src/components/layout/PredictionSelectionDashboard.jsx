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
};

const getPrediction = () => {
  const predictionId = Cookies.get("predictionId");
};

const resetPrediction = () => {
  Cookies.remove("predictionId");
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
