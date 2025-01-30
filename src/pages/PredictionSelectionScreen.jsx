import { useState } from "react";
import PredictionSelectionSection from "../components/predictions-dashboard/PredictionSelectionSection";
import PredictionToggle from "../components/predictions-dashboard/PredictionToggle";

export default function PredictionSelectionScreen() {
  const [activeButton, changeActiveButton] = useState();

  function onToggleClicked(pressedButton) {
    changeActiveButton(pressedButton);
  }

  const isResultsScreen = activeButton === "results";
  return (
    <div className="flex flex-col items-center gap-4">
      <PredictionToggle activeButton={activeButton} onClick={onToggleClicked} />
      {isResultsScreen ? (
        <PredictionSelectionSection />
      ) : (
        <PredictionSelectionSection results={false} />
      )}
    </div>
  );
}
