import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";
import { useEffect, useState } from "react";
import api from "./services/api";
import { UserDetailsContext } from "./store/user-details-context";

function App() {
  const [signIn, setSignIn] = useState(false);
  const [user_id, setUserId] = useState(null);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await api.get(`auth/check_cookie`);
        setUserId(res.data);
        console.log("User ID:", res.data);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    fetchUserId();
  }, [signIn]);

  const ctxValue = {
    setSignIn: () => {
      setSignIn(true);
    },
    user_id: user_id,
    setCookie: setCookie,
    getCookie: getCookie,
    deleteCookie: deleteCookie,
  };

  console.log("Cookie:", Cookies.get('username'));
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
