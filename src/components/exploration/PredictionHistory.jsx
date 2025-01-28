import PrimaryContainer from "../layout/PrimaryContainer";
import PastPredictionContainer from "./PastPredictionContainer";
import {riskAssessments} from "../../assets/data/data"

export default function PredictionHistory() {
    return (
       <PrimaryContainer className="w-full !hover:none">
        <div className="flex flex-row justify-between mt-4 mx-4">
            <h2>Past Predictions</h2>
            <h3>Patient Id: 31231</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mx-20 my-12">
            {riskAssessments.map((item, index) => (
                <PastPredictionContainer {...item} key={index}/>
            ))}
        </div>
       </PrimaryContainer> 
    )
}