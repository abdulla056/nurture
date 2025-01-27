import BlueContainer from "../layout/BlueContainer";
import PrimaryContainer from "../layout/PrimaryContainer";

export default function PredictionCause({ patient, overview = true }) {
  return (
    <PrimaryContainer className={overview ? "gap-6 -mt-24 items-center" : "!flex-row items-center text-nowrap justify-between w-2/3 px-8"}>
      <h3 className="text-font-tertiary text-2xl">Predicted Cause</h3>
      <BlueContainer className="text-2xl text-font font-medium items-center mx-4">
        {patient.cause}
      </BlueContainer>
      <a href="" className="text-secondary">
        Learn more
      </a>
    </PrimaryContainer>
  );
}
