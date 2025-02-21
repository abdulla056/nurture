import { motion } from "framer-motion";

export default function AddPredictionModelSelector({
  selector,
  active,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-row justify-between items-center text-xl w-1/4 p-4 rounded-xl cursor-pointer select-none transition-colors duration-150 shadow-md ${
        active ? "bg-primary text-white" : " bg-background text-font"
      }`}
    >
      <div
        className={`rounded-full h-full p-3 border-2 ${
          active ? "bg-white" : ""
        }`}
      ></div>
      <div className="w-full flex justify-center">{selector}</div>
    </motion.div>
  );
}
