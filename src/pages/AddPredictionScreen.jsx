import PrimaryContainer from "../components/layout/PrimaryContainer";
import TextField from "../components/common/TextField";

import { addPredictionFields } from "../assets/data/add-prediction";
import PrimaryButton from "../components/common/PrimaryButton";
import { useRef, useState } from "react";
import SelectionDashboardDropDown from "../components/predictions-dashboard/SelectionDashboardDropDown";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { useNavigate } from "react-router-dom";
import AddPredictionDropDown from "../components/predictions-dashboard/AddPredictionDropDown";
import AddPredictionModelSelector from "../components/predictions-dashboard/AddPredictionSelector";
import AddPredictionProgressPopUp from "../components/predictions-dashboard/AddPredictionProgressPopUp";
import { predictAndExplain } from "../services/predictions";

const descriptions = [
  "Click Next to start the prediction form. Enter required maternal and fetal health data, including Patient ID, demographics, maternal health indicators, and fetal monitoring data (e.g., CTG readings). Ensure all fields are complete and accurate before submitting for reliable results.",
  "Based on the inputs provided, assess and enter the patient's risk data. This includes evaluating maternal health factors, such as age, medical history, and pre-existing conditions. Ensure that all data is thoroughly reviewed and accurately recorded to facilitate precise risk analysis and prediction outcomes.",
  "Please select the desired data to make the prediction. The data you select here will determine the parameters that are used to make the machine learning prediction.",
];

const predictionSelector = [
  { key: "risk", selector: "Risk Factors" },
  { key: "lifestyle", selector: "Life Style Factors" },
  { key: "demographic", selector: "Demographic Factors" },
];

export default function AddPredictionScreen() {
  const [modelSelected, setModelSelected] = useState();
  const [pageNumber, updatePageNumber] = useState(-1);
  const [isProgressPopupOpen, setIsProgressPopupOpen] = useState(false);
  const patientAddedDialog = useRef();
  const progressDialog = useRef();

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

  function onFormSubmit(modelSelected) {
    switch (modelSelected) {
      case "risk":
        console.log("Risk data", riskData);
        break;
      case "lifestyle":
        console.log("Lifestyle data", lifeStyleData);
        break;
      case "demographic":
        console.log("Demographic data", demographicData);
        break;
    }
    predictAndExplain(modelSelected, formData[pageNumber]).then(() => {
      // setIsProgressPopupOpen(true);
      // progressDialog.current.showModal();
      console.log("Prediction successful");
    });
    // setIsProgressPopupOpen(true);
    // progressDialog.current.showModal();
  }

  function onModelSelectorPressed(selected) {
    if (selected === modelSelected) {
      setModelSelected(null);
    } else {
      setModelSelected(selected);
    }
  }

  const end = addPredictionFields.length === pageNumber;
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
      <AddPredictionProgressPopUp
        ref={progressDialog}
        isOpen={isProgressPopupOpen}
      />
      {end ? (
        <div className="flex flex-col items-center gap-8 mb-8">
          <h3>Select Data for Prediction</h3>
          <span className="text-font-tertiary w-2/3 text-center">
            {descriptions[2]}
          </span>
          {predictionSelector.map((selector) => (
            <AddPredictionModelSelector
              selector={selector.selector}
              key={selector.key}
              active={modelSelected === selector.key}
              onClick={() => onModelSelectorPressed(selector.key)}
            />
          ))}
        </div>
      ) : (
        // <AddPredictionProgressPopUp/>
        <>
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-center">
              {start
                ? "Add a prediction"
                : addPredictionFields[pageNumber].title}
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
                      {...field}
                      value={formData[pageNumber][field.id]}
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
        </>
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
          animate={end ? (modelSelected ? true : false) : true}
          isActive={end ? (modelSelected ? true : false) : true}
          onClick={
            end
              ? modelSelected
                ? () => onFormSubmit(modelSelected)
                : null
              : () => onNextClicked()
          }
        >
          {end ? "Make prediction" : "Continue"}
        </PrimaryButton>
      </div>
    </PrimaryContainer>
  );
}
