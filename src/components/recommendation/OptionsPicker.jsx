const options = ["Very Low", "Low", "Moderate", "High", "Very High"];

export default function OptionsPicker({ children, onChange, name }) {
  return (
    <div className="w-full">
      <label className="flex flex-col mb-4">{children}</label>
      <div className="flex flex-row justify-between mx-16">
        {options.map((option) => (
          <div key={option} className="flex flex-col items-center">
            <span>{option}</span>
            <label>
              <input
                type="radio"
                name={name}
                value={option}
                className="form-radio hover:cursor-pointer"
                onChange={(e) => onChange(e.target.value)}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
