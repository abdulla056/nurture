import PrimaryContainer from "../layout/PrimaryContainer";
import { pastPredictions } from "../../assets/data/data";
import PastPredictionContainer from "./PastPredictionContainer";
import SecondaryButton from "../auth/SecondaryButton";
import { useNavigate } from "react-router-dom";
import {PredictionDetailsContext} from "../../store/prediction-details-context";
import { useContext } from "react";

export default function PastPredictions() {
  const { pastPredictions } = useContext(PredictionDetailsContext);
  console.log(pastPredictions);
  const navigate = useNavigate();
  return (
    <PrimaryContainer className="hover:scale-100 gap-4 hover:cursor-default">
      <div className="flex flex-row justify-between">
        <h3 className="font-medium">Past Predictions</h3>
        <SecondaryButton className="!mt-0" onClick={()=>navigate("/selection-dashboard/add-prediction")}>Add a prediction</SecondaryButton>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          {pastPredictions.map((predcitionItem) => (
            <PastPredictionContainer key={predcitionItem.timestamp}  {...predcitionItem} />
          ))}
        </div>
        <SecondaryButton className="bg-secondary text-small mt-0 h-12 px-10">
          See all
        </SecondaryButton>
      </div>
    </PrimaryContainer>
  );
}
