import BlueContainer from "../layout/BlueContainer"

export default function PastPredictionContainer({date, time}) {
    return (
        <BlueContainer className="items-center !gap-4 !w-32 h-auto hover:scale-105 hover:brightness-95 hover:cursor-pointer transition-all duration-200">
            <span className="text-2xl font-medium">{date}</span>
            <span className="text-lg text-secondary">{time}</span>
        </BlueContainer>
    )
}