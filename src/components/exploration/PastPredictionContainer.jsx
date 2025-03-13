import { useRef } from "react";
import PopUp from "../layout/PopUp";
import PrimaryButton from "../common/PrimaryButton";

export default function PastPredictionContainer({
  timestamp,
  riskLevel,
  prediction,
}) {
  const predictionDetailsPopup = useRef();
  function onSelect() {
    predictionDetailsPopup.current.showModal();
  }
  const date = new Date(timestamp);
  const month = date.toLocaleString("en-US", { month: "long" }); // Full month name
  const day = date.getDate(); // Day of the month
  const time = date.toTimeString().split(" ")[0]; // Extract time in HH:MM:SS format
  return (
    <div
      className="flex flex-col bg-background rounded-xl items-center p-6 gap-4 hover:brightness-90 transition-all duration-150 hover:cursor-pointer"
      onClick={onSelect}
    >
      <PopUp ref={predictionDetailsPopup}>
        {"PATIENT ID:" + prediction.patientId}
        <Div>
          <span>Date & Time</span>
          <h3>{month + " " + day + " | " + time}</h3>
        </Div>
        <Div>
          <span>Risk Level</span>
          <h3>{riskLevel}</h3>
        </Div>
        <Div>
          <PrimaryButton>Go to prediction</PrimaryButton>
          <a className="text-secondary">Close</a>
        </Div>
      </PopUp>
      <h3 className="text-font w-2/3 text-center">{month + " " + day}</h3>
      <span className="text-secondary text-lg">{time}</span>
      <div>
        <span className="text-lg risk-score">Risk Score</span>
        <span className="text-secondary text-xl font-semibold">
          {" " + riskLevel}
        </span>
      </div>
    </div>
  );
}

function Div({ children }) {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
}
