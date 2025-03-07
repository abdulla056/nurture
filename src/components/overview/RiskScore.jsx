import PrimaryContainer from "../../components/layout/PrimaryContainer";
import riskScoreImage from "../../assets/images/risk-score-image.png";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";
import GaugeChart from "./GaugeChart";

const riskDescription =
  "This is a high risk case and immediate action should be taken";

export default function RiskScore({ isConfidence }) {
  const { riskScore, confidenceScore } = useContext(PredictionDetailsContext);
  return (
    <PrimaryContainer className="items-center" disableHover={false}>
      <h3 className="text-font-tertiary font-light">{isConfidence ? "Confidence Score" : "Risk Score"}</h3>
      {/* <img src={riskScoreImage} alt="Risk Score Image" className="w-40" /> */}
      <GaugeChart value={isConfidence ? (confidenceScore*100) : riskScore} isConfidence={isConfidence}/>
      {/* <div className="flex flex-col items-center gap-2">{isConfidence ? confidenceScore : riskScore}</div> */}
      <span className="text-xsmall text-font-tertiary font-extralight">
        {riskDescription}
      </span>
    </PrimaryContainer>
  );
}
