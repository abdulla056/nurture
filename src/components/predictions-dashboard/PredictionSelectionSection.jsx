import PrimaryContainer from "../layout/PrimaryContainer";
import OverviewContainer from "./OverviewContainer";
import { motion, AnimatePresence } from "framer-motion";

// import { patientDataVariations } from "../../assets/data/add-prediction";

export default function PredictionSelectionSection({
  isPrediction = true,
  isActive = false,
  changeOverViewStatus,
  predictions = predictions,
  patients = patients,
}) {
  return (
    <PrimaryContainer
      className={` ${
        isActive ? "w-full" : "w-2/12 justify-center cursor-pointer"
      }`}
      onClick={!isActive && changeOverViewStatus}
    >
      <AnimatePresence>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full gap-4 flex flex-col p-4"
          >
            {(isPrediction ? predictions : patients).map((item, index) => (
              <OverviewContainer
                key={index}
                {...(isPrediction
                  ? { predictionData: item }
                  : { patientData: item })}
                isPrediction={isPrediction}
                enableOverview={changeOverViewStatus}
              />
            ))}
          </motion.div>
        ) : (
          <motion.span
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-primary underline"
          >
            Click here to see all results
          </motion.span>
        )}
      </AnimatePresence>
    </PrimaryContainer>
  );
}
