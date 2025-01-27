import PrimaryContainer from "../layout/PrimaryContainer";
import { pastPredictions } from "../../assets/data/data";
import PastPredictionContainer from "./PastPredictionContainer";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function PastPredictions() {
  return (
    <PrimaryContainer className="hover:scale-100 gap-4 hover:cursor-default">
      <div className="flex flex-row justify-between">
        <h3 className="font-medium">Past Predictions</h3>
        <PrimaryButton className="!mt-0">Add a prediction</PrimaryButton>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          {pastPredictions.map((predcitionItem) => (
            <PastPredictionContainer key={predcitionItem.date}  {...predcitionItem} />
          ))}
        </div>
        <PrimaryButton className="bg-secondary text-small mt-0 h-12 px-10">
          See all
        </PrimaryButton>
      </div>
    </PrimaryContainer>
  );
}
