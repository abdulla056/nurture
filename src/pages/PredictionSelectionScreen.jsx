import { useState } from "react";
import PredictionSelectionSection from "../components/predictions-dashboard/PredictionSelectionSection";
import PredictionToggle from "../components/predictions-dashboard/PredictionToggle";
import PredictedResultOverview from "../components/predictions-dashboard/PredictedResultOverview";
import { motion, AnimatePresence } from "framer-motion";
import HoveringButton from "../components/overview/HoveringButton";
import { useNavigate } from "react-router-dom";

export default function PredictionSelectionScreen() {
  const [activeButton, changeActiveButton] = useState("results");
  const [overViewActivated, changeOverView] = useState(false);

  const navigate = useNavigate();

  function onToggleClicked(pressedButton) {
    changeActiveButton(pressedButton);
  }

  function onOverviewChanged() {
    changeOverView((currentStatus) => !currentStatus);
  }

  function navigateToAddScreen() {
    if (isResultsScreen) {
      navigate("/selection-dashboard/add-prediction");
    } else {
      navigate("/selection-dashboard/add-patient");
    }
  }

  const isResultsScreen = activeButton === "results";

  return (
    <div className="flex flex-col items-center gap-4 prediction-selection relative">
      <AnimatePresence mode="popLayout">
        {!overViewActivated && (
          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <PredictionToggle
              activeButton={activeButton}
              onClick={onToggleClicked}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="flex flex-row gap-4 w-full" layout>
        <PredictionSelectionSection
          results={isResultsScreen}
          isActive={!overViewActivated}
          changeOverViewStatus={() => onOverviewChanged()}
        />
        <PredictedResultOverview isActive={overViewActivated} />
      </motion.div>
      <HoveringButton onClick={navigateToAddScreen}>
        {isResultsScreen || overViewActivated
          ? "Add a prediction"
          : "Add a patient"}
      </HoveringButton>
    </div>
  );
}
