import BlueContainer from "../layout/BlueContainer"
const date = "January 12"
const time = "12:00 PM"

export default function PastPredictionContainer({timestamp}) {
    return (
        <BlueContainer className="items-center !gap-4 !w-auto h-auto hover:scale-105 hover:brightness-95 hover:cursor-pointer transition-all duration-200">
            <span className="text-2xl font-medium">{date}</span>
            <span className="text-lg text-secondary">{time}</span>
        </BlueContainer>
    )
}