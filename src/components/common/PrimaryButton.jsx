import { motion } from "framer-motion";

export default function PrimaryButton({
  children,
  className,
  transparent = false,
  animate = true,
  ...props
}) {
  return (
    <motion.button
      {...props}
      whileHover={animate && { scale: 1.07 }} 
      whileTap={animate &&{ scale: 0.95 }}
      className={`flex items-center justify-center py-4 px-12 rounded-xl hover:opacity-90 text-xl 
  ${
    transparent
      ? "bg-none text-primary border border-black"
      : "bg-primary text-white"
  } ${className}`}
    >
      {children}
    </motion.button>
  );
}
