import PrimaryContainer from "../layout/PrimaryContainer";
import PastPredictionContainer from "./PastPredictionContainer";
import SecondaryButton from "../auth/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";

export default function PastPredictions() {
  const { pastPredictions } = useContext(PredictionDetailsContext);
  const navigate = useNavigate();
  return (
    <PrimaryContainer className="hover:scale-100 gap-4 hover:cursor-default">
      <div className="flex flex-row justify-between">
        <h3 className="font-medium">Past Predictions</h3>
        <SecondaryButton
          className="!mt-0"
          onClick={() => navigate("/selection-dashboard/add-prediction")}
        >
          Add a prediction
        </SecondaryButton>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          {pastPredictions.slice(0,6).map((predictionItem) => (
            <PastPredictionContainer
              key={predictionItem.timestamp}
              predictionItem={predictionItem}
              {...predictionItem}
            />
          ))}
        </div>
        <SecondaryButton
          className="bg-secondary text-small mt-0 h-12 px-10"
          onClick={() => navigate("/dashboard/exploration/prediction-history")}
        >
          See all
        </SecondaryButton>
      </div>
    </PrimaryContainer>
  );
}
