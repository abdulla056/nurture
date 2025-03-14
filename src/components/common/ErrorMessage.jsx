import { motion } from "framer-motion";

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="fixed top-12 left-0 w-full flex justify-center z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
      >
        {message}
        <button className="ml-4 text-white font-bold" onClick={onClose}>
          ✖
        </button>
      </motion.div>
    </div>
  );
};

export default ErrorMessage;
