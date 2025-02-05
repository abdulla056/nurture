// import { useRoutes } from "react-router-dom";
// import routes from "./routes";
// // import {SignUpPage} from "./pages/SignUpPage.jsx"

// function App() {
//   return (
//     <>
//       <AppRoutes />
//     </>
//   );
// }
// function AppRoutes() {
//   return useRoutes(routes);
// }

// export default App;


import api from "./services/api";
import { useState, useEffect } from "react";

export default function App() {

  const [data, setData] = useState([{}]);

  useEffect(() => {
    api.get("/members").then(
      res => {
        console.log(res.data)
        setData(res.data)
      }
    )
  }, [])
  
  return (
    <div>
      {(typeof data.members === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        data.members.map((member, index) => (
          <p key={index}>{member}</p>
        ))
      )}
    </div>
  );
}
