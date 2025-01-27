export default function PrimaryButton({ children, onClick, className}) {
  return (
    <button
      onClick={onClick}
      className={`bg-primary text-white py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  );
}
