import NavBar from "./NavBar";
import Overview from "../../pages/Overview";
import Analysis from "../../pages/Analysis";
import Exploration from "../../pages/DataExploration";
import Recommendations from "../../pages/Recommendations";
import { Route, Routes } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="px-12 py-4">
      <NavBar />
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/exploration" element={<Exploration />} />
        <Route path="/recommendation" element={<Recommendations />} />
      </Routes>
    </div>
  );
}
