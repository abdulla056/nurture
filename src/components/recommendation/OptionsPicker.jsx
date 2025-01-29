const options = ["Very Low", "Low", "Moderate", "High", "Very High"];

export default function OptionsPicker({children}) {
  return (
    <div className="w-full">
      <label className="flex flex-col mb-4">{children}</label>
      <div className="flex flex-row justify-between mx-16">
        {options.map((option) => (
          <div key={option} className="flex flex-col items-center">
            <span>{option}</span>
            <label>
              <input type="radio" name="accuracy" className="form-radio hover:cursor-pointer" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
