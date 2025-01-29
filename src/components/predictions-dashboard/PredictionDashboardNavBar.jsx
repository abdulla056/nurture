import Logo from "../common/Logo";
import PredictionDashboardNavBarButton from "./PredictionDashboardNavBarButton";

export default function PredictionDashboardNavBar() {
  return (
    <div className="flex flex-row justify-between w-full items-center">
      <Logo color={"black"} />
      <div className="flex flex-row gap-10">
        <PredictionDashboardNavBarButton>Home</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton>Help</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton>Logout</PredictionDashboardNavBarButton>
      </div>
    </div>
  );
}
