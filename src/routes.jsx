// src/routes.js
import { Navigate } from "react-router-dom";
import Dashboard from "./components/layout/Dashboard";
import PredictionSelectionDashboard from "./components/layout/PredictionSelectionDashboard";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Analysis from "./pages/Analysis";
import DataExploration from "./pages/DataExploration";
import Recommendations from "./pages/Recommendations";
import ContributingFactors from "./components/exploration/ContributingFactors";
import ComparativeAnalysis from "./components/exploration/ComparativeAnalysis";
import PredictionHistory from "./components/exploration/PredictionHistory";
import PredictionSelectionScreen from "./pages/PredictionSelectionScreen";
import AddPredictionScreen from "./pages/AddPredictionScreen";
import AddPatientScreen from "./pages/AddPatientScreen";

const routes = [
  { path: "/", element: <Navigate to="/authentication" /> },
  { path: "/authentication", element: <SignUpPage />,},
  { path: "/home", element: <Home /> },
  {
    path: "/selection-dashboard",
    element: <PredictionSelectionDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="/selection-dashboard/result-selection" />,
      },
      { path: "result-selection", element: <PredictionSelectionScreen /> },
      { path: "add-prediction", element: <AddPredictionScreen /> },
      { path: "add-patient", element: <AddPatientScreen /> },
    ],
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" /> },
      { path: "overview", element: <Overview /> },
      { path: "analysis", element: <Analysis /> },
      {
        path: "exploration",
        element: <DataExploration />,
        children: [
          { index: true, element: <Navigate to="contributing-factors" /> },
          { path: "contributing-factors", element: <ContributingFactors /> },
          { path: "comparative-analysis", element: <ComparativeAnalysis /> },
          { path: "prediction-history", element: <PredictionHistory /> },
        ],
      },
      { path: "recommendation", element: <Recommendations /> },
    ],
  },
];

export default routes;
