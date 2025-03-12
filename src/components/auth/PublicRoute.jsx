import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserDetailsContext } from "../../store/user-details-context";

const PublicRoute = ({ element }) => {
    const { isAuthenticated, setIsAuthenticated, checkAuthCookie} = useContext(UserDetailsContext);
    // const [isAuthenticated, setIsAuthenticated] = useState(null);
      
    checkAuthCookie();
  return isAuthenticated ? <Navigate to="/selection-dashboard" /> : element;
};

export default PublicRoute;