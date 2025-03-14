import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./routes";
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";
import { useEffect, useState } from "react";
import api from "./services/api";
import { UserDetailsContext } from "./store/user-details-context";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthCookie();
      setIsLoading(false); // Set loading to false after authentication check
    };
    if (!isAuthenticated) {
      checkAuth();
    }
    
  }
  , [location.pathname, isAuthenticated]); 

  // Context value to provide to the app
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

  const ctxValue = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken,
    checkAuthCookie,
    logout: () => {
      Cookies.remove("authToken");
      setIsAuthenticated(false);
      setToken(null);
      navigate("/authentication");
    },
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show a loading spinner or message
  }
  
  return (
    <UserDetailsContext.Provider value={ctxValue}>
      <AppRoutes />
    </UserDetailsContext.Provider>
  );
}

function AppRoutes() {
  return useRoutes(routes);
}

export default App;
