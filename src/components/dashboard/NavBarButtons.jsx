import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function NavBarButtons({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <Link
      to={to}
      className={`py-3 text-regular rounded-full w-48 flex justify-center
    ${
      isActive
        ? "bg-primary text-white"
        : "bg-white text-primary hover:bg-primary  hover:text-white transition-all duration-150"
    }`}
    >
      {children}
    </Link>
  );
}
