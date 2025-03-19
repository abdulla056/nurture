export default function PredictionDashboardNavBarButton({ children, to, ...props }) {

  return (
    <div {...props} className="flex flex-col items-center gap-1 navbar-button hover:cursor-pointer">
      <span className="text-xl font-medium">{children}</span>
      <div className="rounded-lg h-1 w-8 bg-primary transition-all duration-200"></div>
    </div>
  );
}
