import ListOfFactors from "../analysis/ListOfFactors"
import PieChart from "./PieChart"

export default function ContributingFactors() {
    return (
        <div className="flex flex-row w-full gap-12 my-12">
            <ListOfFactors/>
            <PieChart/>
        </div>
    )
}