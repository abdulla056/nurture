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
        <div
          className="gap-4 flex flex-row fixed left-1/2  transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: "87%" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <PrimaryButton
              className={
                "opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"
              }
            >
              Export to CSV
            </PrimaryButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <PrimaryButton
              className={
                "opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"
              }
            >
              Download PDF
            </PrimaryButton>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
