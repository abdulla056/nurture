import PrimaryContainer from "../layout/PrimaryContainer"
import OverviewContainer from "./OverviewContainer"

import { patientDataVariations } from "../../assets/data/add-prediction"

export default function PredictionSelectionSection({results = true}) {
    return (
        <PrimaryContainer className="w-full">
            <h3>Predicted Results</h3>
            {patientDataVariations.map((patient, index)=>(
                <OverviewContainer patientData={patient} key={index} results={results}/>
            ))}
        </PrimaryContainer>
    )
}