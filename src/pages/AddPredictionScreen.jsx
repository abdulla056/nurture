import PrimaryContainer from "../components/layout/PrimaryContainer";
import TextField from "../components/common/TextField";

import { predictionFields } from "../assets/data/add-prediction";
import PrimaryButton from "../components/common/PrimaryButton";
import { useState } from "react";

const description =
  "Based on the inputs provided, assess and enter the patient's risk data. This includes evaluating maternal health factors, such as age, medical history, and pre-existing conditions. Ensure that all data is thoroughly reviewed and accurately recorded to facilitate precise risk analysis and prediction outcomes.";

export default function AddPredictionScreen() {
  const [pageNumber, updatePageNumber] = useState(0);

  function onNextClicked() {
    updatePageNumber((currentPageNumber) => currentPageNumber + 1);
  }

  function onBackClick() {
    updatePageNumber((currentPageNumber) => currentPageNumber - 1);
  }

  const end = (predictionFields.length === pageNumber+1);

  return (
    <PrimaryContainer className="items-center !p-12 !px-16 !gap-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-center">{predictionFields[pageNumber].title}</h3>
        <span className="text-font-tertiary w-2/3 text-center">
          {description}
        </span>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-24">
        {predictionFields[pageNumber].fields.map((field) => (
          <TextField label={field} type={"text"} />
        ))}
      </div>
      <div className="flex flex-row gap-4">
        <PrimaryButton transparent={true} onClick={() => onBackClick()}>
          Go back
        </PrimaryButton>
        <PrimaryButton onClick={() => onNextClicked()}>{end ? "Make prediction" : "Continue"}</PrimaryButton>
      </div>
    </PrimaryContainer>
  );
}
