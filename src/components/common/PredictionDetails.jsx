import IconButton from "../common/IconButton"

export default function PredictionDetails({icon, title, data}) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <IconButton icon={icon}/>
            <div className="flex flex-col">
                <span className="text-xs text-font-tertiary">{title}</span>
                <span className="text-xs text-font">{data}</span>
            </div>
        </div>
    )
}