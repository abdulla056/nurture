import ExplorationNavBar from "../components/exploration/ExplorationNavBar";
import { Outlet } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";

export default function DataExploration() {
  return (
    <div className="flex flex-col items-center relative">
      <ExplorationNavBar />
      <Outlet />
      <div className="gap-4 flex flex-row fixed left-1/2  transform -translate-x-1/2 -translate-y-1/2" style={{top:"87%"}}>
        <PrimaryButton className={"opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"}>Export to CSV</PrimaryButton>
        <PrimaryButton className={"opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"}>Download PDF</PrimaryButton>
      </div>
    </div>
  );
}
