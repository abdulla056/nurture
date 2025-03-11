export default function PredictionOverviewSection({title, description, children}) {
    return (
        <div className="flex flex-col">
            <h3>{title}</h3>
            <span className="text-font-tertiary">{description}</span>
            {children}
        </div>
    )
}