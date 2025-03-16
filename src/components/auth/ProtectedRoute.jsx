import { Navigate } from "react-router-dom";
import api from "../../services/api";
import { useContext, useState } from "react";
import { UserDetailsContext } from "../../store/user-details-context";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, setIsAuthenticated, checkAuthCookie} = useContext(UserDetailsContext);
  // const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  return isAuthenticated ? element : <Navigate to="/authentication" />;
};

export default ProtectedRoute;