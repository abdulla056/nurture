export default function DashboardButton({children, to, ...props}) {
  return (
    <button {...props} className="bg-background-container opacity-90 text-2xl flex justify-center items-center gap-2 shrink-0 rounded-lg text-primary py-6 px-6">
      {children}
    </button>
  );
}
