import { useEffect, useState } from "react";

export default function TextField({ id, label, formDataChanged, value, options, ...props }) {
  const [fieldValue, setFieldValue] = useState(value || "");

  useEffect(() => {
    setFieldValue(value || "");
  }, [value]);

  function handleValueChange(event) {
    setFieldValue(event.target.value);
    formDataChanged(event.target.value, id);
  }
  return (
    <div className="flex flex-col mt-4 w-full whitespace-nowrap max-md:max-w-full items-start">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        required
        value={fieldValue}
        onChange={handleValueChange}
        id={id}
        className="flex pr-2 pl-2 mt-2.5 w-full text-font-tertiary bg-white rounded-xl border border-solid border-stone-300 min-h-[38px]"
      />
    </div>
  );
}
