import BlueContainer from "../layout/BlueContainer";

export default function PregnancyDetails({data, title, description}) {
    return (
        <BlueContainer className="items-start gap-4">
            <div>
                <span className="text-2xl font-semibold text-secondary">{data}&nbsp;</span>
                <span className="text-2xl font-semibold text-font">{title}</span>
            </div>
            <span className="text-sm text-font-tertiary">{description}</span>
        </BlueContainer>
    )
}