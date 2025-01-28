import ExplorationNavBarButton from "./ExplorationNavBarButton";
import { useEffect, useState } from "react";

export default function ExplorationNavBar() {
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
        <div className={`flex flex-row justify-center w-screen sticky top-20 z-50 bg-background py-4 ${hasShadow && "shadow-sm"}`}>
            <div className="w-2/3 flex flex-row">
            <ExplorationNavBarButton to={"contributing-factors"}>Contributing Factors</ExplorationNavBarButton>
            <ExplorationNavBarButton to={"comparative-analysis"}>Comparative Analysis</ExplorationNavBarButton>
            <ExplorationNavBarButton to={"prediction-history"}>Prediction History</ExplorationNavBarButton>
            </div>
        </div>
    )
}