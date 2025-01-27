import OverviewButton from "../overview/OverviewButton";
import CustomLine from "./CustomLine";

export default function HeadingSection({overview = true, patient}) {
  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-primary font-medium"> {overview ? "SUMMARY" : "PREDICTION ANALYSIS"} </h1>
        {overview && <OverviewButton>See all predicted results</OverviewButton>}
        <div className="flex flex-row">
          <h3 className="text-font">Patient ID:</h3>
          <h3 className="text-secondary">{patient.id}</h3>
        </div>
      </div>
      <CustomLine />
    </>
  );
}
