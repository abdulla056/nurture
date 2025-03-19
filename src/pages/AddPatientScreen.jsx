import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/common/PrimaryButton";
import TextField from "../components/common/TextField";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import SelectionDashboardDropDown from "../components/predictions-dashboard/SelectionDashboardDropDown";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { useRef, useState } from "react";
import api from "../services/api";
import { AnimatePresence } from "framer-motion";
import ErrorMessage from "../components/common/ErrorMessage";

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
  const [error, setError] = useState("");
  const patientAddedDialog = useRef();
  const [patientId, setPatientId] = useState("");
  const [pregnancyDate, setPregnancyDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();

  function handlePatientIdChange(value) {
    setPatientId(value);
  }

  function handlePregnancyDateChange(value) {
    setPregnancyDate(value);
  }

  function handleBirthDate(value) {
    setBirthDate(value);
  }

  async function onSubmit() {
    if (patientId === "") {
      setError("Please enter a patient ID");
      return;
    } else {
      await addPatient({patientId, pregnancyDate, birthDate}).then(() => {
        patientAddedDialog.current.showModal();
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence>
        {error !== "" && (
          <ErrorMessage message={error} onClose={() => setError("")} />
        )}
      </AnimatePresence>
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
          <div className="w-full flex flex-col items-center">
            <span className="text-small -mb-3">Pregnancy date</span>
            <TextField
              type={"date"}
              id={"pregnancyDate"}
              formDataChanged={(value) => handlePregnancyDateChange(value)}
              value={pregnancyDate}
            />
          </div>
          <div className="w-full flex flex-col items-center">
            <span className="text-small -mb-3">Pregnancy date</span>
            <TextField
              type={"date"}
              id={"birthDate"}
              formDataChanged={(value) => handleBirthDate(value)}
              value={birthDate}
            />
          </div>
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
