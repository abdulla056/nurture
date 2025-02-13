import PrimaryContainer from "../layout/PrimaryContainer";
import OverviewContainer from "./OverviewContainer";
import { motion, AnimatePresence } from "framer-motion";

import { patientDataVariations } from "../../assets/data/add-prediction";

export default function PredictionSelectionSection({
  results = true,
  isActive = false,
  changeOverViewStatus
}) {
  return (
    <PrimaryContainer className={` ${isActive ? "w-full" : "w-2/12 justify-center cursor-pointer"}`} onClick={!isActive ? changeOverViewStatus : undefined}>
      <AnimatePresence>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full gap-4 flex flex-col p-4"
          >
            <h3>{results ? "Predicted Results" : "List of Patients"}</h3>
            {patientDataVariations.map((patient, index) => (
              <OverviewContainer
                patientData={patient}
                key={index}
                results={results}
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
