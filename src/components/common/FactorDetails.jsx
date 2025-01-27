import InfoButton from "./InfoButton";
import ProgressBar from "./ProgressBar";

export default function FactorDetails({
  main = false,
  title,
  description,
  percentage,
}) {
  return (
    <div
      className={`flex flex-row border-t border-[#C5C5C5] -mx-6 py-4 justify-between ${
        main ? "bg-[#E4EAFF] px-8" : "bg-white px-14"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-xs text-[#7E8184]">
          {main ? "Biggest Factor" : "Factor"}
        </span>
        <span className={main ? "text-2xl" : "text-xl"}>{title}</span>
        <span className="text-xsmall text-[#7E8184]">{description}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-1">
          <ProgressBar main={main} percentage={percentage}/>
          <InfoButton main={main} />
        </div>
        <span className="text-secondary">{percentage + "%"}</span>
      </div>
    </div>
  );
}
