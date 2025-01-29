import PrimaryContainer from "../components/layout/PrimaryContainer";
import TextField from "../components/common/TextField"

import { predictionFields } from "../assets/data/add-prediction";

const firstOne = predictionFields[1];

const description =
  "Based on the inputs provided, assess and enter the patient's risk data. This includes evaluating maternal health factors, such as age, medical history, and pre-existing conditions. Ensure that all data is thoroughly reviewed and accurately recorded to facilitate precise risk analysis and prediction outcomes.";

export default function AddPredictionScreen() {
  return (
    <PrimaryContainer className="items-center !p-12 !px-16">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-center">{firstOne.title}</h3>
        <span className="text-font-tertiary w-2/3 text-center">{description}</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-24">
        {firstOne.fields.map((field)=>(
            <TextField label={field} type={"text"}/>
        ))}
      </div>
    </PrimaryContainer>
  );
}
