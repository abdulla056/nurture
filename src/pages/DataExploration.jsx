import ExplorationNavBar from "../components/exploration/ExplorationNavBar";
import { Outlet } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";
import { AnimatePresence, motion } from "framer-motion";

export default function DataExploration() {
  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <ExplorationNavBar />
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
