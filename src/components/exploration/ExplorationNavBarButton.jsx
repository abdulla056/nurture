import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function ExplorationNavBarButton({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <Link
      to={to}
      className={`py-3 text-regular w-full flex justify-center
    ${
      isActive
        ? "bg-[#008080] text-white"
        : "bg-white text-[primary] hover:bg-[#008080]  hover:text-white transition-all duration-150"
    }`}
    >
      {children}
    </Link>
  );
}
