import { motion } from "framer-motion";

export default function PrimaryButton({
  children,
  className,
  transparent = false,
  animate = true,
  isActive = true,
  ...props
}) {
  return (
    <motion.button
      {...props}
      whileHover={animate && { scale: 1.07 }}
      whileTap={animate && { scale: 0.95 }}
      className={`flex items-center justify-center py-4 px-12 rounded-xl hover:opacity-90 text-xl 
  ${
    isActive
      ? transparent
        ? "bg-transparent text-primary border border-black"
        : "bg-primary text-white"
      : "!bg-gray-100 !text-gray-400 disabled"
  } 
  ${className}`}
    >
      {children}
    </motion.button>
  );
}
