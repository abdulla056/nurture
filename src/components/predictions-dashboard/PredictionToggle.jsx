import PredictionToggleButton from "./PredictionToggleButton";
import { motion } from "framer-motion";

export default function PredictionToggle({ activeButton, onClick }) {
  const resultsActive = activeButton === "results";
  return (
    <div className="flex flex-row bg-white rounded-2xl w-1/4 justify-between p-1 shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)] relative">
      <motion.div
        className="absolute w-1/2 h-full top-0 bg-primary rounded-2xl"
        animate={{ left: resultsActive ? "0%" : "50%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
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
