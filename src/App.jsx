import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { use } from "react";
import { UserDetailsContext } from "./store/user-details-context";

function App() {
  const [signIn, setSignIn] = useState(false);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   } else{
  //     navigate("/login");
  //   }
  // }, []);

  const ctxValue = {
    setSignIn: () => {
      setSignIn(true);
    },
    user_id
  };

  useEffect(() => {
    console.log("IT WORKS");
  }, [signIn]);

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
