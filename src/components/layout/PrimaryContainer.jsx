export default function PrimaryContainer({ children, className = "", disableHover = true, onClick}) {
  return (
    <div
      className={`hover:shadow-lg transition-all duration-500 gap-6 py-4 px-6 bg-white rounded-xl flex flex-col shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)] ${className} ${disableHover ? "" : " custom-hover hover:cursor-pointer"}`} onClick={onClick}
    >
      {children}
    </div>
  );
}
