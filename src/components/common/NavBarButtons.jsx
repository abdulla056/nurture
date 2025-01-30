import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavBarButtons({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: false });

  return (
    <motion.div
      whileHover={{ scale: 1.05}} 
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Link
        to={to}
        className={`py-3 text-regular rounded-full w-full flex justify-center transition-colors duration-150
          ${
            isActive
              ? "bg-primary text-white"
              : "bg-white text-primary hover:bg-primary hover:text-white"
          }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
