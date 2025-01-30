import PredictionToggleButton from "./PredictionToggleButton";

export default function PredictionToggle({ activeButton, onClick }) {
  return (
    <div className="flex flex-row bg-white rounded-2xl w-1/4 justify-between p-1 shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)]">
      <PredictionToggleButton
        isActive={activeButton === "results"}
        onClick={() => onClick("results")}
      >
        Results
      </PredictionToggleButton>
      <PredictionToggleButton
        isActive={activeButton === "patients"}
        onClick={() => onClick("patients")}
      >
        Patients
      </PredictionToggleButton>
    </div>
  );
}
