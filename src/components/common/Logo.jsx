import whiteLogo from "../../assets/images/nurture-logo-white.png";
import blackLogo from "../../assets/images/nurture-logo-black.png";

export default function Logo({ color }) {
  const logo = color === "black" ? blackLogo : whiteLogo;

  return (
    <img
      src={logo}
      alt="nurture logo"
      className="object-contain self-center max-w-full aspect-[2.98] w-[271px] hover:opacity-90 delay-300  transition-colors hover:cursor-pointer"
    />
  );
}
