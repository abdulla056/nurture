const patientId = ["323123", "31543", "42374"]

export default function SelectionDashboardDropDown({title}) {
  return (
    <form className="w-full flex flex-col items-center gap-3">
      <label className="text-small">{title}</label>
      <select
        className="bg-[#F8F8F8] text-font py-2 px-4 rounded-md w-full border"
        name="patientId"
        id="patientId"
      >
        {patientId.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </form>
  );
}
