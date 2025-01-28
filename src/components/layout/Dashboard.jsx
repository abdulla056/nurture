import NavBar from "./NavBar";
import Overview from "../../pages/Overview";
import Analysis from "../../pages/Analysis";
import DataExploration from "../../pages/DataExploration";
import Recommendations from "../../pages/Recommendations";
import { Route, Routes, Navigate } from "react-router-dom";
import ContributingFactors from "../exploration/ContributingFactors";
import ComparativeAnalysis from "../exploration/ComparativeAnalysis";
import PredictionHistory from "../exploration/PredictionHistory";

export default function Dashboard() {
  return (
    <div className="px-12 py-4 relative">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/exploration" element={<DataExploration />}>
          <Route index element={<Navigate to="contributing-factors" />} />
          <Route
            path="contributing-factors"
            element={<ContributingFactors />}
          />
          <Route
            path="comparative-analysis"
            element={<ComparativeAnalysis />}
          />
          <Route path="prediction-history" element={<PredictionHistory />} />
        </Route>
        <Route path="/recommendation" element={<Recommendations />} />
      </Routes>
    </div>
  );
}
