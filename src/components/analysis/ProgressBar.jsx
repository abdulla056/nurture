export default function ProgressBar({ main, percentage }) {
  
  return (
    <div
      className={`flex items-center p-0.5 w-20 h-6 border rounded-2xl border-[#C5C5C5] ${
        main && "!h-8 !w-28 rounded-xl"
      } `}
    >
      <div
      id="progressIndicator"
        className={`bg-secondary h-full rounded-xl ${
          main && "rounded-lg"
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
