import BlueContainer from "../layout/BlueContainer";
import PrimaryContainer from "../layout/PrimaryContainer";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";

export default function PredictionCause({ overview = true }) {
  const { expectedOutcome } = useContext(PredictionDetailsContext);
  return (
    <PrimaryContainer
      disableHover={false}
      className={
        overview
          ? "gap-6 -mt-24 items-center"
          : "!flex-row items-center text-nowrap justify-between w-auto px-8"
      }
    >
      <h3 className="text-font-tertiary text-2xl">Predicted Cause</h3>
      <BlueContainer className="text-2xl text-font font-medium items-center mx-4 text-center">
        {expectedOutcome}
      </BlueContainer>
      <a href="" className="text-secondary">
        Learn more
      </a>
    </PrimaryContainer>
  );
}
