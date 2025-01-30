import { useEffect, useState } from "react";
import Logo from "../common/Logo";
import PredictionDashboardNavBarButton from "./PredictionDashboardNavBarButton";

export default function PredictionDashboardNavBar() {
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={`flex flex-row justify-between items-center sticky top-0 z-50 bg-background ${hasShadow && "shadow-sm -mx-20 px-20"}`}>
      <Logo color={"black"} />
      <div className="flex flex-row gap-10">
        <PredictionDashboardNavBarButton>Home</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton>Help</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton>Logout</PredictionDashboardNavBarButton>
      </div>
    </div>
  );
}
