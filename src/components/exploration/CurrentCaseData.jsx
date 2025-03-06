import { useState } from "react";
import PrimaryContainer from "../layout/PrimaryContainer";
import CurrentCaseDataSelector from "./CurrentCaseDataSelector";
import LineChart from "./LineChart";

const features = [
  "Fetal heart rate",
  "Maternal age",
  "Alcoholism",
  "Gestational week",
  "Blood pressure",
  "Glucose levels",
];

export default function CurrentCaseData() {
  const [activeButton, setActiveButton] = useState();

  function onSelectorPressed(selectedButton) {
    setActiveButton(selectedButton);
  }

  return (
    <PrimaryContainer className="w-7/12 !p-7">
      <h2>Risk Score Over Time</h2>
      <div className="grid grid-cols-3 gap-4">
        {features.map((item, index) => (
          <CurrentCaseDataSelector
            onPress={() => onSelectorPressed(index)}
            isSelected={activeButton === index}
            key={index}
          >
            {item}
          </CurrentCaseDataSelector>
        ))}
      </div>
      <LineChart/>
    </PrimaryContainer>
  );
}
