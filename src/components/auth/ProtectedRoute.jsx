import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../services/api";
import { useState } from "react";
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
    const checkAuthCookie = async () => {
      try {
        const response = await api.get("/auth/check_cookie", { withCredentials: true });
        if (response.data[1].valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsAuthenticated(false);
        } else {
          console.error("Error checking authentication:", error);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuthCookie();
    
    if (isAuthenticated === null) {
      return null; // or a loading spinner
    }
  
  return isAuthenticated ? element : <Navigate to="/authentication" />;
};

export default ProtectedRoute;