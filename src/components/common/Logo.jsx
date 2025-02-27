import whiteLogo from "../../assets/images/nurture-logo-white.png";
import blackLogo from "../../assets/images/nurture-logo-black.png";
import { useNavigate } from "react-router-dom";

export default function Logo({ color }) {
  const navigate = useNavigate();
  const logo = color === "black" ? blackLogo : whiteLogo;

  return (
    <img
      onClick={() => navigate("/home")}
      src={logo}
      alt="nurture logo"
      className="object-contain self-center max-w-full aspect-[2.98] w-[271px] hover:opacity-90 delay-300  transition-colors hover:cursor-pointer -ml-5"
    />
  );
}
