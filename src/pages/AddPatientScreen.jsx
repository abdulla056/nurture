import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";
import TextField from "../components/common/TextField";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import SelectionDashboardDropDown from "../components/predictions-dashboard/SelectionDashboardDropDown";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { useRef, useState } from "react";
import api from "../services/api";

const addPatient = async (patientId) => {
  try {
    const response = await api.post(
      "/patient/add",
      { patientId: patientId },
      { withCredentials: true }
    );
    return response.data; // Returns prediction result
  } catch (error) {
    console.error("Error calling add patient API:", error);
    throw error;
  }
};

export default function AddPatientScreen() {
  const patientAddedDialog = useRef();
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  function handlePatientIdChange(value) {
    setPatientId(value);
  }

  async function onSubmit() {
    await addPatient(patientId).then(() => {
      patientAddedDialog.current.showModal();
    });
  }

  console.log(patientId);
  return (
    <div className="flex flex-col gap-6">
      <ConfirmationPopup
        firstButton={"Make prediction"}
        secondButton={"See all patients"}
        actionFirstButton={() =>
          navigate("/selection-dashboard/add-prediction")
        }
        actionSecondButton={() => navigate("/selection-dashboard")}
        ref={patientAddedDialog}
        description={
          "You can either choose to make a prediction for this patient or see all patients again"
        }
        title={"Patient has been added successfully!"}
      />
      <PrimaryContainer className="items-center mx-32">
        <div className="w-1/2 flex flex-col gap-10 items-center my-16">
          <h2 className="text-center">Add Patient</h2>
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="-mb-6">Patient ID</span>
            <TextField
              type={"text"}
              id={"patientId"}
              formDataChanged={(value) => handlePatientIdChange(value)}
              value={patientId}
            />
            <PrimaryButton className={"!w-52 h-12 bg-secondary text-regular"}>
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
