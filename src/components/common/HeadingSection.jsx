import PrimaryButton from "./PrimaryButton";
import CustomLine from "./CustomLine";
import { useNavigate } from "react-router-dom";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";

export default function HeadingSection({overview = true}) {
  const { patientId } = useContext(PredictionDetailsContext);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-primary font-medium"> {overview ? "SUMMARY" : "PREDICTION ANALYSIS"} </h1>
        {overview && <PrimaryButton onClick={()=> navigate("/selection-dashboard")}>See all predicted results</PrimaryButton>}
        <div className="flex flex-row">
          <h3 className="text-font">Patient ID:</h3>
          <h3 className="text-secondary">{patientId}</h3>
        </div>
      </div>
      <CustomLine />
    </>
  );
}
