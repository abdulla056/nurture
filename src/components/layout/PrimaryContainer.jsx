export default function PrimaryContainer({ children, className = "" }) {
  return (
    <div
      className={`hover:scale-105 hover:shadow-lg transition-all duration-150 hover:cursor-pointer gap-6 py-4 px-6 bg-white rounded-xl flex flex-col shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}
