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


import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState([{}]);
  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
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
