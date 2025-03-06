import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import SUPERVISEDSCREENTEST from "./pages/SUPERVISEDSCREENTEST";

function App() {
  // useEffect(() => {
  //   const token = localStorage.getItem('token'); 
  //   if (token) {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   } else{
  //     navigate("/login");
  //   }
  // }, []); 
  return (
    <>
      <SUPERVISEDSCREENTEST />
    </>
  );
}
function AppRoutes() {
  return useRoutes(routes);
}

export default App;
