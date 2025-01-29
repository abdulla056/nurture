import AddPredictionScreen from "../../pages/AddPredictionScreen";
import PredictionDashboardNavBar from "../predictions-dashboard/PredictionDashboardNavBar";

export default function PredictionSelectionDashboard() {
  return (
    <div className="flex flex-col py-2 px-20 gap-6">
      <PredictionDashboardNavBar />
      <AddPredictionScreen/>
    </div>
  );
}
