import Logo from "../common/Logo";
import NavBarButtons from "../common/NavBarButtons";
import notification from "../../assets/images/notification.png";
import setting from "../../assets/images/setting.png";
import IconButton from "../common/IconButton";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`flex flex-row items-center justify-between mb-6 sticky top-0 z-50 bg-background transition-all duration-150 ${
      hasShadow ? "shadow-sm -mx-12 px-12" : ""}`}>
      <Logo color={"black"} />
      <div className="flex flex-row w-7/12 justify-between gap-2">
        <NavBarButtons to="/overview">Overview</NavBarButtons>
        <NavBarButtons to="/analysis">Analysis</NavBarButtons>
        <NavBarButtons to="/exploration">Data Exploration</NavBarButtons>
        <NavBarButtons to="/recommendation">Recommendation</NavBarButtons>
      </div>
      <div className="flex flex-row gap-1.5">
        <IconButton icon={notification} />
        <IconButton icon={setting} />
      </div>
    </div>
  );
}
