import { useEffect, useState } from "react";
import api from "../../services/api";
const doctorId = "D002"

export default function SelectionDashboardDropDown({ title }) {
  const [patientId, setPatientId] = useState([]);
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const res = await api.get(`/patient/get_all/${doctorId}`);
        setPatientId(res.data);
      } catch (error) {
        console.error("Error fetching prediction details:", error);
      }
    };
    fetchPatientId();
  }, []);
  return (
    <form className="w-full flex flex-col items-center gap-3">
      <label className="text-small">{title}</label>
      <select
        className="bg-[#F8F8F8] text-font py-2 px-4 rounded-md w-full border"
        name="patientId"
        id="patientId"
      >
        {patientId.map((option, index) => (
          <option value={option.patientId} key={index}>{option.patientId}</option>
        ))}
      </select>
    </form>
  );
}
