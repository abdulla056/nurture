export default function PredictionDashboardNavBarButton({children}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-medium">{children}</span>
            <div className="rounded-lg h-1 w-8 bg-primary"></div>
        </div>
    )
}