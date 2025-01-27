import fetusImage from "../../assets/images/fetus-picture.png";
import PredictionCause from "../common/PredictionCause";

export default function PredictedCauseSection({ patient }) {
  return (
    <div
      className="flex flex-col w-4/12 hover:opacity-80 transition-all duration-150"
      id="predictedCause"
    >
      <img src={fetusImage} alt="Image of the fetus" />
      <PredictionCause patient={patient}/>
    </div>
  );
}
