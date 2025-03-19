import { useContext, useEffect, useState } from "react";
import Logo from "../common/Logo";
import PredictionDashboardNavBarButton from "./PredictionDashboardNavBarButton";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../services/authentication";
import { UserDetailsContext } from "../../store/user-details-context";

export default function PredictionDashboardNavBar() {
  const [hasShadow, setHasShadow] = useState(false);
  const {setIsAuthenticated} = useContext(UserDetailsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onLogout() {
    let userConfirmed = confirm("Are you sure you want to log out?");

    if (userConfirmed) {
      try {
        await logout();
        // deleteCookie();
        setIsAuthenticated(false);
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error);
      }
      navigate("/authentication");
    }
  }
  return (
    <div className={`flex flex-row justify-between items-center sticky top-0 z-50 bg-background ${hasShadow && "shadow-sm -mx-20 px-20"}`}>
      <Logo color={"black"} />
      <div className="flex flex-row gap-10">
        <PredictionDashboardNavBarButton to={"/home"}>Home</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton>Help</PredictionDashboardNavBarButton>
        <PredictionDashboardNavBarButton onClick={()=>onLogout()}>Logout</PredictionDashboardNavBarButton>
      </div>
    </div>
  );
}
