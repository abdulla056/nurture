import { useState } from "react";
import PrimaryContainer from "../layout/PrimaryContainer";
import OverviewContainer from "./OverviewContainer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";

const ITEMS = 6;

export default function PredictionSelectionSection({
  isPrediction = true,
  isActive = false,
  changeOverViewStatus,
  predictions = predictions,
  patients = patients,
}) {
  const [visibleCount, setVisibleCount] = useState(ITEMS);

  const items = isPrediction ? predictions : patients;
  const visibleItems = items.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS);
  };
  return (
    <PrimaryContainer
      className={` ${
        isActive ? "w-full" : "w-2/12 justify-center cursor-pointer"
      }`}
      onClick={!isActive ? changeOverViewStatus : undefined}
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
            {visibleItems.map((item, index) => (
              <OverviewContainer
                key={index}
                {...(isPrediction
                  ? { predictionData: item }
                  : { patientData: item })}
                isPrediction={isPrediction}
                enableOverview={() => changeOverViewStatus(item.detailId)}
              />
            ))}
            {visibleCount < items.length && (
              <button
                className=" w-1/6 flex justify-between items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg transition"
                onClick={handleShowMore}
              >
                Show more
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
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
