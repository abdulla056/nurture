import { motion } from "framer-motion";

export default function HoveringButton({ className = "", children, ...props }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
      style={{ top: "87%" }}
      className={`fixed left-1/2 shadow-2xl transform -translate-x-1/2 -translate-y-1/2 opacity-75 hover:opacity-100
      bg-primary text-white py-6 px-10 rounded-2xl transition-all duration-150 text-xl
      hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
