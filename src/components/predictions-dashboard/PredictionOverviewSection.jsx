export default function PredictionOverviewSection({title, description, image}) {
    return (
        <div className="flex flex-col">
            <h3>{title}</h3>
            <span className="text-font-tertiary">{description}</span>
            <img src={image} alt="graph" />
        </div>
    )
}