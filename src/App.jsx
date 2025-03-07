import { useRoutes } from "react-router-dom";
import routes from "./routes";
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";
import { useEffect, useState } from "react";
import api from "./services/api";
import { UserDetailsContext } from "./store/user-details-context";

import Cookies from 'js-cookie';

const setCookie = () => {
  Cookies.set('username', 'Abdulla', { expires: 7 }); // Expires in 7 days
  console.log('Cookie set!');
};

const getCookie = () => {
  const username = Cookies.get('username');
  console.log(username);
};

const deleteCookie = () => {
  Cookies.remove('username');
  console.log('Cookie removed!');
};


function App() {
  const [signIn, setSignIn] = useState(false);
  // const [user_id, setUserId] = useState(null);
  // const [sessionId, setSessionId] = useState(null);
  const [token, setToken] = useState(null);
  console.log("token", token);
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
    setSignIn: () => {
      setSignIn(true);
    },
    // user_id: user_id,
    setToken: (token) => {
      setToken(token);
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
