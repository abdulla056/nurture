export default function PrimaryContainer({ children, className = "", disableHover = true}) {
  return (
    <div
      className={`hover:shadow-lg hover:cursor-pointer transition-all duration-150 gap-6 py-4 px-6 bg-white rounded-xl flex flex-col shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)] ${className} ${disableHover ? "" : " hover:scale-105"}`}
    >
      {children}
    </div>
  );
}
