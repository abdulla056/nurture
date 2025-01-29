export default function PrimaryButton({ children, onClick, className, type, transparent = false}) {
    return (
      <button
      type={type}
        onClick={onClick}
        className={`flex items-center justify-center py-3 px-24 rounded-xl hover:opacity-90 transition-all duration-150 text-xl 
        ${transparent ? "bg-none text-primary border border-black" : "bg-primary text-white"} ${className}`}      
      >
        {children}
      </button>
    );
  }
  