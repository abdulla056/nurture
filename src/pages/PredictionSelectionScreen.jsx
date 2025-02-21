import { useEffect, useState } from "react";
import PredictionSelectionSection from "../components/predictions-dashboard/PredictionSelectionSection";
import PredictionToggle from "../components/predictions-dashboard/PredictionToggle";
import PredictedResultOverview from "../components/predictions-dashboard/PredictedResultOverview";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import HoveringButton from "../components/overview/HoveringButton";
import { useNavigate } from "react-router-dom";

export default function PredictionSelectionScreen() {
  const [activeButton, changeActiveButton] = useState("results");
  const [overViewActivated, changeOverView] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [patients, setPatients] = useState([]);

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

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await api.get("/details/get_all_predictions");
        console.log(res.data);
        setPredictions(res.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await api.get("/patient/get_all/D001");
        console.log(res.data);
        setPatients(res.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPredictions();
    fetchPatients();
  }, []);

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
          predictions={predictions}
          patients={patients}
          isPrediction={isResultsScreen}
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
