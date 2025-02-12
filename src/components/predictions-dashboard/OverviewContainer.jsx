import PredictionInfo from "./PredictionInfo";
import calendaricon from "../../assets/images/calendar-black.png";
import PrimaryButton from "../common/PrimaryButton";
import trashIcon from "../../assets/images/trash-icon.png";

const keyFactors = [
  "Maternal age",
  "Gestational diabetes",
]

export default function OverviewContainer({
  predictionData,
  results,
  enableOverview,
}) {
  return (
    <div className="flex flex-row border rounded-2xl items-center justify-between px-6 py-2">
      {results && (
        <PredictionInfo titleBottom={false} title={"Patient ID"}>
          <span className="text-lg font-semibold text-secondary">
            {predictionData.PatientID}
          </span>
        </PredictionInfo>
      )}
      <PredictionInfo title={"Risk level"}>
        <div>Indicator</div>
        <span>{"patientData.riskLevel"}</span>
      </PredictionInfo>
      {!results && (
        <PredictionInfo title={"Patient ID"}>
          <h3 className=" text-primary">{"patientData.patientId"}</h3>
        </PredictionInfo>
      )}
      {results && (
        <PredictionInfo title={"Risk score"}>
          <span className="text-2xl">{"patientData.riskScore "+ "%"}</span>
        </PredictionInfo>
      )}
      <PredictionInfo title={ results ? "Date" : "Birth Date"}>
        <img src={calendaricon} alt="Icon" className="w-1/4" />
        <span>{'patientData.date'}</span>
      </PredictionInfo>
      <PredictionInfo title={results ? "Time" : "Pregnancy Date"}>
        <img src={calendaricon} alt="Icon" className="w-1/4" />
        <span>{"patientData.time"}</span>
      </PredictionInfo>
      {results && (
        <PredictionInfo titleBottom={false} title={"Key factors"}>
          {keyFactors.map((factor, index) => (
            <span key={index}>{factor}</span>
          ))}
          <PrimaryButton className={"scale-50 p-2"} animate={false}>View all</PrimaryButton>
        </PredictionInfo>
      )}
      <PredictionInfo title={"Delete"}>
        <img src={trashIcon} alt="trash icon" className="w-1/5" />
      </PredictionInfo>
      <div className="flex flex-col scale-75 gap-2 -mr-3">
        <PrimaryButton onClick={results && enableOverview}>
          {results ? "View more details" : "View all predictions"}
        </PrimaryButton>
        <PrimaryButton transparent={true}>Go to dashboard</PrimaryButton>
      </div>
    </div>
  );
}
