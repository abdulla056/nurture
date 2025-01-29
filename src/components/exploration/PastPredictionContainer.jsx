export default function PastPredictionContainer({date, time, riskScore}) {
    return (
        <div className="flex flex-col bg-background rounded-xl items-center p-6 gap-4 hover:brightness-90 transition-all duration-150 hover:cursor-pointer">
            <h3 className="text-font w-2/3 text-center">{date}</h3>
            <span className="text-secondary text-lg">{time}</span>
            <div>
                <span className="text-lg risk-score">Risk Score</span>
                <span className="text-secondary text-xl font-semibold">{" " + riskScore}</span>
            </div>
        </div>
    )
}