export default function SecondaryButton({ onClick, type = "button", children, className = "" }) {
  return (
    <button
      type={type}
      className={`bg-opacity-90 gap-2.5 self-stretch px-16 py-3 mt-12 max-w-full text-base font-semibold
        text-white whitespace-nowrap rounded-xl bg-primary max-md:px-5 max-md:mt-10
        hover:bg-opacity-100 transition-bg-opacity duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
