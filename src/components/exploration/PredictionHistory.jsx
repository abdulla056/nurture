import PrimaryContainer from "../layout/PrimaryContainer";
import PastPredictionContainer from "./PastPredictionContainer";
import {riskAssessments} from "../../assets/data/data"
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { useContext } from "react";

export default function PredictionHistory() {
    const { pastPredictions, patientId } = useContext(PredictionDetailsContext);
    console.log("past predictions", riskAssessments);
    return (
       <PrimaryContainer className="w-full !hover:none">
        <div className="flex flex-row justify-between mt-4 mx-4">
            <h2>Past Predictions</h2>
            <h3>{"Patient ID:" + patientId} </h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mx-20 my-12">
            { pastPredictions.map((item, index) => (
                <PastPredictionContainer timestamp={item.timestamp} prediction={item} riskLevel={item.riskLevel} key={index}/>
            ))}
            {/* {riskAssessments.map((item, index) => (
                <PastPredictionContainer {...item} key={index}/>
            ))} */}
        </div>
       </PrimaryContainer> 
    )
}