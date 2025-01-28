import CurrentCaseData from "./CurrentCaseData";
import SimilarCaseData from "./SimilarCaseData";

export default function ComparativeAnalysis() {
    return (
        <div className="flex flex-row w-full gap-6">
            <CurrentCaseData/>
            <SimilarCaseData/>
        </div>
    )
}