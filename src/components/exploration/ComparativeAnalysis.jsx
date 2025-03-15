import CurrentCaseData from "./CurrentCaseData";
import PCACluster from "./PCACluster";
import SimilarCaseData from "./SimilarCaseData";

export default function ComparativeAnalysis() {
    return (
        <div className="flex flex-row w-full gap-6">
            <CurrentCaseData/>
            <PCACluster/>
        </div>
    )
}