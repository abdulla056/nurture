import PrimaryContainer from "../components/layout/PrimaryContainer";
import TextField from "../components/common/TextField";

import { addPredictionFields } from "../assets/data/add-prediction";
import PrimaryButton from "../components/common/PrimaryButton";
import { useRef, useState } from "react";
import SelectionDashboardDropDown from "../components/predictions-dashboard/SelectionDashboardDropDown";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { useNavigate } from "react-router-dom";
import CustomDropDown from "../components/common/CustomDropDown";
import AddPredictionDropDown from "../components/predictions-dashboard/AddPredictionDropDown";

const descriptions = [
  "Click Next to start the prediction form. Enter required maternal and fetal health data, including Patient ID, demographics, maternal health indicators, and fetal monitoring data (e.g., CTG readings). Ensure all fields are complete and accurate before submitting for reliable results.",
  "Based on the inputs provided, assess and enter the patient's risk data. This includes evaluating maternal health factors, such as age, medical history, and pre-existing conditions. Ensure that all data is thoroughly reviewed and accurately recorded to facilitate precise risk analysis and prediction outcomes.",
];

export default function AddPredictionScreen() {
  const [pageNumber, updatePageNumber] = useState(-1);
  const patientAddedDialog = useRef();

  const [lifeStyleData, setLifeStyleData] = useState({
    ...addPredictionFields[0].fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  });

  const [riskData, setRiskData] = useState({
    ...addPredictionFields[1].fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  });

  const [demographicData, setDemographicData] = useState({
    ...addPredictionFields[2].fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  });

  const [flagsData, setFlagsData] = useState({
    ...addPredictionFields[3].fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  });

  const formData = [lifeStyleData, riskData, demographicData, flagsData];
  const setFormData = [
    setLifeStyleData,
    setRiskData,
    setDemographicData,
    setFlagsData,
  ];

  function formDataChanged(newValue, id) {
    setFormData[pageNumber]((prevFormData) => ({
      ...prevFormData,
      [id]: newValue,
    }));
  }

  function onNextClicked() {
    updatePageNumber((currentPageNumber) => currentPageNumber + 1);
  }

  function onBackClick() {
    updatePageNumber((currentPageNumber) => currentPageNumber - 1);
  }

  function onFormSubmit() {
    console.log(formData);
    patientAddedDialog.current.showModal();
  }

  const end = addPredictionFields.length === pageNumber + 1;
  const start = pageNumber === -1;

  const navigate = useNavigate();

  console.log(formData);

  return (
    <PrimaryContainer className="items-center !p-12 !px-16 !gap-6">
      <ConfirmationPopup
        ref={patientAddedDialog}
        firstButton={"Go to dashboard"}
        actionFirstButton={() => navigate("/dashboard")}
        secondButton={"See all predictions"}
        title={"Prediction has been processed successfully!"}
        description={
          "You can either choose to go to the dashboard or see all predictions again"
        }
      />
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-center">
          {start ? "Add a prediction" : addPredictionFields[pageNumber].title}
        </h3>
        <span className="text-font-tertiary w-2/3 text-center">
          {start ? descriptions[0] : descriptions[1]}
        </span>
      </div>
      {start ? (
        <SelectionDashboardDropDown title={"Patient ID"} />
      ) : (
        <div className="grid grid-cols-2 w-full gap-x-24">
          {addPredictionFields[pageNumber].fields.map((field, index) => (
            <>
              {field.options ? (
                <AddPredictionDropDown
                  options={field.options}
                  label={field.label}
                  value={formData[pageNumber][field.id]}
                  id={field.id}
                  key={index}
                  formDataChanged={formDataChanged}
                />
              ) : (
                <TextField
                  formDataChanged={formDataChanged}
                  label={field.label}
                  value={formData[pageNumber][field.id] || ""}
                  id={field.id}
                  type={"text"}
                  key={index}
                />
              )}
            </>
          ))}
        </div>
      )}
      <div className="flex flex-row gap-4">
        <PrimaryButton
          transparent={true}
          onClick={
            start ? () => navigate("/selection-dashboard") : () => onBackClick()
          }
        >
          Go back
        </PrimaryButton>
        <PrimaryButton
          onClick={end ? () => onFormSubmit() : () => onNextClicked()}
        >
          {end ? "Make prediction" : "Continue"}
        </PrimaryButton>
      </div>
    </PrimaryContainer>
  );
}
