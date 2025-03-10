import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element }) => {
  const authToken = Cookies.get("authToken");

  return authToken ? element : <Navigate to="/authentication" />;
};

export default ProtectedRoute;