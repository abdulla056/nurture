import PrimaryContainer from "../../components/layout/PrimaryContainer";
import BlueContainer from "../../components/layout/BlueContainer";
import fetusImage from "../../assets/images/fetus-picture.png";

export default function PredictedCauseSection({ patient }) {
  return (
    <div
      className="flex flex-col w-4/12 hover:opacity-80 transition-all duration-150"
      id="predictedCause"
    >
      <img src={fetusImage} alt="Image of the fetus" />
      <PrimaryContainer className="gap-6 -mt-24">
        <h3 className="text-font-tertiary">Predicted Cause</h3>
        <BlueContainer className="text-2xl text-font font-medium">
          {patient.cause}
        </BlueContainer>
        <a href="" className="text-secondary">
          Learn more
        </a>
      </PrimaryContainer>
    </div>
  );
}
