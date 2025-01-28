import ExplorationNavBar from "../components/exploration/ExplorationNavBar";
import { Outlet, NavLink } from "react-router-dom";

export default function DataExploration() {
  return (
    <div className="flex flex-col items-center relative">
      <ExplorationNavBar />
      <Outlet/>
    </div>
  );
}
