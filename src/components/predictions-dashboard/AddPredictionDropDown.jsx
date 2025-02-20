import { useEffect, useState } from "react";

export default function SelectField({ id, label, formDataChanged, value, options, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || "");

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  function handleValueChange(event) {
    setSelectedValue(event.target.value);
    formDataChanged(event.target.value, id);
  }

  return (
    <div className="flex flex-col mt-4 w-full whitespace-nowrap max-md:max-w-full items-start">
      <label htmlFor={id}>{label}</label>
      <select
        {...props}
        id={id}
        value={selectedValue}
        onChange={handleValueChange}
        className="flex pr-2 pl-2 mt-2.5 w-full text-font-tertiary bg-white rounded-xl border border-solid border-stone-300 min-h-[38px]"
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={Number(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
