import { useEffect, useState, useRef } from "react";
import PredictionSelectionSection from "../components/predictions-dashboard/PredictionSelectionSection";
import PredictionToggle from "../components/predictions-dashboard/PredictionToggle";
import PredictedResultOverview from "../components/predictions-dashboard/PredictedResultOverview";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import HoveringButton from "../components/overview/HoveringButton";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";

export default function PredictionSelectionScreen() {
  const [activeButton, changeActiveButton] = useState("results");
  const [overViewActivated, changeOverView] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [overViewData, setOverViewData] = useState();
  const [patientPredictions, setPatientPredictions] = useState([]);

  const navigate = useNavigate();

  function onToggleClicked(pressedButton) {
    changeActiveButton(pressedButton);
  }

  function onOverviewChanged(predictionId) {
    setOverViewData(
      predictions.find((prediction) => prediction.detailId === predictionId)
    );
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
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchPredictions = async () => {
      try {
        const res = await api.get("/details/get_all_predictions", {
          withCredentials: true,
        });
        setPredictions(res.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await api.get("/patient/get_all", {
          withCredentials: true,
        });
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
            className="flex w-full justify-center flex-col items-center gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <PredictionToggle
              activeButton={activeButton}
              onClick={onToggleClicked}
            />
            {(patientPredictions.length > 0 && activeButton === "results") && (
              <PrimaryButton
              className={"size-12 !text-xs px-16 opacity-75"}
                onClick={() => setPatientPredictions([])}
              >
                View all predictions
              </PrimaryButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="flex flex-row gap-4 w-full" layout>
        <PredictionSelectionSection
          predictions={predictions}
          patients={patients}
          patientPredictions={patientPredictions}
          setPatientPredictions={setPatientPredictions}
          isPrediction={isResultsScreen}
          changeActiveButton={changeActiveButton}
          isActive={!overViewActivated}
          changeOverViewStatus={onOverviewChanged}
        />
        <PredictedResultOverview
          isActive={overViewActivated}
          prediction={overViewData}
        />
      </motion.div>
      <HoveringButton onClick={navigateToAddScreen}>
        {isResultsScreen || overViewActivated
          ? "Add a prediction"
          : "Add a patient"}
      </HoveringButton>
    </div>
  );
}
