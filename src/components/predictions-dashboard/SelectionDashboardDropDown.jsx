import { useEffect, useState } from "react";
import api from "../../services/api";
const patientIds = [1,2,3,4,5,6,7,8,9,10];

export default function SelectionDashboardDropDown({ title, setPatientId }) {
  const [patientIds, setPatientIds] = useState([]);
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const res = await api.get(`/patient/get_all`, { withCredentials: true });
        const patientIds = res.data.map((patient) => patient.patientId); // Extract patient IDs
        setPatientIds(patientIds); 
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
    <form className="w-full flex flex-col items-center gap-3">
      <label className="text-small">{title}</label>
      <select
        className="bg-[#F8F8F8] text-font py-2 px-4 rounded-md w-full border"
        name="patientId"
        id="patientId"
        onChange={onPatientIdChange}
      >
        {patientIds.map((option, index) => (
          <option value={option} key={index}>{option}</option>
        ))}
      </select>
    </form>
  );
}
