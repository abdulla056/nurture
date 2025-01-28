import CustomLine from "../common/CustomLine";
import PrimaryContainer from "../layout/PrimaryContainer";
import ModelPerformance from "./ModelPerformance";
import ShapExplanation from "./ShapExplanation";

export default function PredictionExplanation() {
  return (
    <PrimaryContainer className="!gap-2 w-3/5">
      <span className="text-2xl pb-2">Prediction Explanation</span>
      <CustomLine className={"!w-auto -mx-6"} />
      <ShapExplanation/>
      <CustomLine className={"!w-auto -mx-6"} />
      <ModelPerformance/>
    </PrimaryContainer>
  );
}
