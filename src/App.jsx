import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./routes";
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";
import { useEffect, useState } from "react";
import api from "./services/api";
import { UserDetailsContext } from "./store/user-details-context";
import Cookies from "js-cookie";

// const setCookie = (authToken) => {
//   Cookies.set("authToken", authToken, { expires: 1 / 24, secure: true, sameSite: "Strict" });
//   console.log("User token set!");
// };

// const getCookie = () => {
//   const authToken = Cookies.get("authToken");
//   console.log(authToken);
// };

// const deleteCookie = () => {
//   Cookies.remove("authToken");
//   console.log("Token cookie removed!");
// };

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  // const [signIn, setSignIn] = useState(false);
  // const [token, setToken] = useState(null);
  // token ? setCookie(token) : null;
  // Check for the cookie when the app loads
  // useEffect(() => {
  //   const checkAuthCookie = async () => {
  //     try {
  //       const response = await api.get("/auth/check_cookie", {withCredentials: true});
  //       console.log(response.data[1].valid);
  //       if (response.data[1].valid) {
  //         // If the token is valid, set the authentication state
  //         console.log
  //         setIsAuthenticated(true);
  //       } else {
  //         // If the token is invalid, clear the cookie and redirect to authentication
  //         setIsAuthenticated(false);
  //         setToken(null);
  //         navigate("/authentication");
  //       }
  //     } catch (error) {
  //       console.error("Error validating token:", error);
  //       setIsAuthenticated(false);
  //       setToken(null);
  //       navigate("/authentication");
  //     }
  //   };

  //   checkAuthCookie();
  // }, [navigate]);

  // Context value to provide to the app
  const ctxValue = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken,
    logout: () => {
      Cookies.remove("authToken");
      setIsAuthenticated(false);
      setToken(null);
      navigate("/authentication");
    },
  };

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
