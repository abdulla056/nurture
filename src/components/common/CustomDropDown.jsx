export default function CustomDropDown({ title, options }) {
  return (
    <form className="w-1/2">
      <label className="text-lg">{title}</label>
      <select className="bg-gray-200 text-primary py-2 px-4 rounded-md w-full appearance-none" name="fruits" id="fruits">
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </form>
  );
}
