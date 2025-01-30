import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="px-12 py-4 relative">
      <NavBar />
      <Outlet />
    </div>
  );
}
