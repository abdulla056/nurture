import { useState } from "react";

export default function CustomDropDown({title, options}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col">
      <span className="text-lg">{title}</span>
      <div>
        <button
          className="bg-gray-200 text-primary py-2 px-4 rounded-md w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption || "Select an option"}
        </button>
        {isOpen && (
          <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg">
            {options.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
