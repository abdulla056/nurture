import PredictionExplanation from "../components/analysis/PredictionExplanation";
import HeadingSection from "../components/common/HeadingSection";
import ListOfFactors from "../components/analysis/ListOfFactors";
import PredictionCause from "../components/common/PredictionCause";
import { AnimatePresence, motion } from "framer-motion";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Analysis() {
  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4 items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <HeadingSection overview={false} patient={patient} />
        <PredictionCause patient={patient} overview={false} />
        <div className="flex flex-row w-full gap-8">
          <ListOfFactors />
          <PredictionExplanation />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
