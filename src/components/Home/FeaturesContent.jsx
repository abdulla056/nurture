import { motion } from "framer-motion";

export default function FeaturesContent({ feature, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, x: 0 }}
      whileInView={{ opacity: 1, x:0 }}
      transition={{ duration: 1.5, ease:"easeInOut"}} 
      viewport={{ once: true }}
      className={`flex rounded-xl w-2/3 py-4 flex-col items-start px-4 transition-all duration-300 gap-2
        ${
          isActive
            ? "bg-[#A1D6E2] h-36"
            : "bg-[#F0F0F0] h-16 hover:bg-[#A1D6E2] hover:cursor-pointer justify-center"
        }`}
    >
      <p className="text-xl">{feature.title}</p>
      {isActive && <p className="text-small">{feature.description}</p>}
    </motion.div>
  );
}
