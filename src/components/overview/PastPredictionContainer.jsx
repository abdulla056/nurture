import { useRef } from "react";
import BlueContainer from "../layout/BlueContainer";
import PopUp from "../layout/PopUp"; 
import PrimaryButton from "../common/PrimaryButton";

export default function PastPredictionContainer({ timestamp, predictionItem }) {
  const date = new Date(timestamp);
  const month = date.toLocaleString("en-US", { month: "long" }); // Full month name
  const day = date.getDate(); // Day of the month
  const time = date.toTimeString().split(" ")[0]; // Extract time in HH:MM:SS format
  const predictionDetailsPopup = useRef();
  function onSelect() {
    predictionDetailsPopup.current.showModal();
  }
  return (
    <>
      <PopUp ref={predictionDetailsPopup}>
        {"PATIENT ID:" + predictionItem.patientId}
        <Div>
          <span>Date & Time</span>
          <h3>{month + " " + day + " | " + time}</h3>
        </Div>
        <Div>
          <span>Risk Level</span>
          <h3>{predictionItem.riskLevel}</h3>
        </Div>
        <Div>
          <PrimaryButton>Go to prediction</PrimaryButton>
          <a className="text-secondary">Close</a>
        </Div>
      </PopUp>
      <BlueContainer
        onClick={() => onSelect()}
        className="items-center !gap-4 !w-auto h-auto hover:scale-105 hover:brightness-95 hover:cursor-pointer transition-all duration-200"
      >
        <span className="text-2xl font-medium">{month + " " + day}</span>
        <span className="text-lg text-secondary">{time}</span>
      </BlueContainer>
    </>
  );
}

function Div({ children }) {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
}
