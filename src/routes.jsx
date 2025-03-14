import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
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
import ProfileScreen from "./pages/ProfileScreen";
import MFAPage from "./components/auth/MFAPage";

const routes = [
  { path: "/", element: <Navigate to="/authentication" /> },

  // Public Routes
  { path: "/authentication", element: <PublicRoute element={<SignUpPage />}/>},
  { path: "/authentication/mfa-page", element: <PublicRoute element={<MFAPage />}/>},
  { path: "/home", element: <Home /> },

  // Protected Routes (Require Login)
  { path: "/profile", element: <ProtectedRoute element={<ProfileScreen />} /> },

  {
    path: "/selection-dashboard",
    element: <ProtectedRoute element={<PredictionSelectionDashboard />} />,
    children: [
      {
        index: true,
        element: <Navigate to="/selection-dashboard/result-selection" />,
      },
      {
        path: "result-selection",
        element: <ProtectedRoute element={<PredictionSelectionScreen />} />,
      },
      {
        path: "add-prediction",
        element: <ProtectedRoute element={<AddPredictionScreen />} />,
      },
      {
        path: "add-patient",
        element: <ProtectedRoute element={<AddPatientScreen />} />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard />} />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" /> },
      { path: "overview", element: <ProtectedRoute element={<Overview />} /> },
      { path: "analysis", element: <ProtectedRoute element={<Analysis />} /> },
      {
        path: "exploration",
        element: <ProtectedRoute element={<DataExploration />} />,
        children: [
          { index: true, element: <Navigate to="contributing-factors" /> },
          {
            path: "contributing-factors",
            element: <ProtectedRoute element={<ContributingFactors />} />,
          },
          {
            path: "comparative-analysis",
            element: <ProtectedRoute element={<ComparativeAnalysis />} />,
          },
          {
            path: "prediction-history",
            element: <ProtectedRoute element={<PredictionHistory />} />,
          },
        ],
      },
      {
        path: "recommendation",
        element: <ProtectedRoute element={<Recommendations />} />,
      },
    ],
  },
];

export default routes;
