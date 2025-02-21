import { useRoutes } from "react-router-dom";
import routes from "./routes";

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
