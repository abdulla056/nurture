import { useEffect, useState } from "react";
import api from "../../services/api";
import PrimaryButton from "../common/PrimaryButton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function SelectionDashboardDropDown({
  title,
  setPatientId,
  addPatientButton = false,
}) {
  const [patientIds, setPatientIds] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const res = await api.get(`/patient/get_all`, {
          withCredentials: true,
        });
        const patientIds = res.data.map((patient) => patient.patientId); // Extract patient IDs
        setPatientIds(patientIds);
        setPatientId(patientIds[0]);
      } catch (error) {
        console.error("Error fetching patient IDs:", error);
      }
    };

    fetchPatientId();
  }, []);

  function onPatientIdChange(e) {
    setPatientId(e.target.value);
  }
  console.log(patientIds);
  return (
    <>
      {addPatientButton && (
        <PrimaryButton
          className={"!w-52 h-12 bg-secondary"}
          onClick={() => navigate("/selection-dashboard/add-patient")}
        >
          <div className="flex flex-row items-center gap-4">
            <span className="text-white text-regular text-nowrap">
              Add patient
            </span>
            <Add />
          </div>
        </PrimaryButton>
      )}
      <form className="w-full flex flex-col items-center gap-3">
        <label className="text-small">{title}</label>
        <select
          className="bg-[#F8F8F8] text-font py-2 px-4 rounded-md w-full border"
          name="patientId"
          id="patientId"
          onChange={onPatientIdChange}
        >
          {patientIds.map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
        </select>
      </form>
    </>
  );
}
