import NavBar from "./NavBar";
import Overview from "../../pages/Overview";
import Analysis from "../../pages/Analysis";
import Exploration from "../../pages/DataExploration";
import Recommendations from "../../pages/Recommendations";
import { Route, Routes, Navigate } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="px-12 py-4 relative">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/exploration" element={<Exploration />} />
        <Route path="/recommendation" element={<Recommendations />} />
      </Routes>
    </div>
  );
}
