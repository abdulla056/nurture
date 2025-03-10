import { useRoutes } from "react-router-dom";
import routes from "./routes";
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";
import { useEffect, useState } from "react";
import api from "./services/api";
import { UserDetailsContext } from "./store/user-details-context";

import Cookies from "js-cookie";

const setCookie = (authToken) => {
  Cookies.set("authToken", authToken, { expires: 1 / 24, secure: true, sameSite: "Strict" });
  console.log("User token set!");
};

const getCookie = () => {
  const authToken = Cookies.get("authToken");
  console.log(authToken);
};

const deleteCookie = () => {
  Cookies.remove("authToken");
  console.log("Token cookie removed!");
};

function App() {
  // const [signIn, setSignIn] = useState(false);
  const [token, setToken] = useState(null);
  token ? setCookie(token) : null;
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const res = await api.get(`auth/check_cookie`);
  //       setUserId(res.data);
  //       console.log("User ID:", res.data);
  //     } catch (error) {
  //       console.error("Error fetching user details", error);
  //     }
  //   };
  //   fetchUserId();
  // }, [signIn]);

  const ctxValue = {
    // setSignIn: () => {
    //   setSignIn(true);
    // },
    token: token,
    setToken: (token) => {
      setToken(token);
    },
    deleteCookie: () => {
      deleteCookie();
    },
    getCookie: () => {
      getCookie();
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
