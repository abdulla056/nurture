export default function TextField({ id, type, label}) {
  return (
      <div className="flex flex-col mt-4 w-full whitespace-nowrap max-md:max-w-full items-start">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          className="flex pr-2 pl-2 mt-2.5 w-full text-font-tertiary bg-white rounded-xl border border-solid border-stone-300 min-h-[38px]"
        />
      </div>
  );
}
