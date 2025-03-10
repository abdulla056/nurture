import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";
import TextField from "../components/common/TextField";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import SelectionDashboardDropDown from "../components/predictions-dashboard/SelectionDashboardDropDown";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { useRef } from "react";

export default function AddPatientScreen() {
  const patientAddedDialog = useRef();
  const navigate = useNavigate();

  function onSubmit() {
    patientAddedDialog.current.showModal();
  }
  return (
    <div className="flex flex-col gap-6">
      <ConfirmationPopup
        firstButton={"Make prediction"}
        secondButton={"See all patients"}
        actionFirstButton={() => navigate("/selection-dashboard/add-prediction")}
        actionSecondButton={() => navigate("/selection-dashboard")}
        ref={patientAddedDialog}
        description={"You can either choose to make a prediction for this patient or see all patients again"}
        title={"Patient has been added successfully!"}
      />
      <PrimaryContainer className="items-center mx-32">
        <div className="w-1/2 flex flex-col gap-10 items-center my-16">
          <h2 className="text-center">Add Patient</h2>
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="-mb-6">Patient ID</span>
            <TextField id={"patientId"} type={"text"} />
            <PrimaryButton className={"bg-secondary scale-90"}>
              Generate ID
            </PrimaryButton>
          </div>
          <SelectionDashboardDropDown title={"Pregnancy duration"} />
          <span className="text-xs text-font-tertiary">
            This system does not store personal or identifying patient data. All
            data is anonymized.
          </span>
        </div>
      </PrimaryContainer>
      <div className="flex flex-row justify-center gap-4">
        <PrimaryButton
          transparent={true}
          onClick={() => navigate("/selection-dashboard")}
        >
          Go back
        </PrimaryButton>
        <PrimaryButton onClick={() => onSubmit()}>Add patient</PrimaryButton>
      </div>
    </div>
  );
}
