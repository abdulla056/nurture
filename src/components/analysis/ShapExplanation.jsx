// import shapChart from "../../assets/images/Shap-chart.png";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";

export default function ShapExplanation() {
  const { shapExplanation } = useContext(PredictionDetailsContext);
  return (
    <div>
      <span className="text-regular text-font-tertiary font-semibold mb-2">
        SHAP Chart
      </span>
      <img src={`data:image/png;base64,${shapExplanation}`} alt="SHAP image" />
    </div>
  );
}
