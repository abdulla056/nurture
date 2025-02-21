import { motion } from "framer-motion";

export default function SecondaryButton({
  type = "button",
  children,
  className = "",
  ...props
}) {
  return (
    <motion.button
      {...props}
      type={type}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-opacity-90 gap-2.5 self-stretch px-16 py-3 mt-12 max-w-full text-base font-semibold
        text-white whitespace-nowrap rounded-xl bg-primary max-md:px-5 max-md:mt-10
        hover:bg-opacity-100 ${className}`}
    >
      {children}
    </motion.button>
  );
}
