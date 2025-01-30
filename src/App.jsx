import { useRoutes } from "react-router-dom";
import routes from "./routes";
// import {SignUpPage} from "./pages/SignUpPage.jsx"

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}
function AppRoutes() {
  return useRoutes(routes);
}

export default App;
