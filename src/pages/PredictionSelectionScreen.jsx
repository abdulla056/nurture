import { useState } from "react";
import PredictionSelectionSection from "../components/predictions-dashboard/PredictionSelectionSection";
import PredictionToggle from "../components/predictions-dashboard/PredictionToggle";
import PredictedResultOverview from "../components/predictions-dashboard/PredictedResultOverview";

export default function PredictionSelectionScreen() {
  const [activeButton, changeActiveButton] = useState("results");
  const [overViewActivated, changeOverView] = useState(false);

  function onToggleClicked(pressedButton) {
    changeActiveButton(pressedButton);
  }

  function onOverviewChanged() {
    changeOverView((currentStatus) => !currentStatus);
  }

  const isResultsScreen = activeButton === "results";

  return (
    <div className="flex flex-col items-center gap-4 prediction-selection">
      {!overViewActivated && (
        <PredictionToggle
          activeButton={activeButton}
          onClick={onToggleClicked}
        />
      )}
      <div className="flex flex-row gap-4 w-full">
        <PredictionSelectionSection
          results={isResultsScreen}
          isActive={!overViewActivated}
          changeOverViewStatus={() => onOverviewChanged()}
        />
        <PredictedResultOverview isActive={overViewActivated} />
      </div>
    </div>
  );
}
