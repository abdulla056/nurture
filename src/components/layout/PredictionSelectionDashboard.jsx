import AddPatientScreen from "../../pages/AddPatientScreen";
import AddPredictionScreen from "../../pages/AddPredictionScreen";
import PredictionSelectionScreen from "../../pages/PredictionSelectionScreen";
import PredictionDashboardNavBar from "../predictions-dashboard/PredictionDashboardNavBar";

export default function PredictionSelectionDashboard() {
  return (
    <div className="flex flex-col py-2 px-20 gap-6 relative">
      <PredictionDashboardNavBar />
      <AddPredictionScreen />
    </div>
  );
}
