import PredictionInfo from "./PredictionInfo";
import calendaricon from "../../assets/images/calendar-black.png";
import PrimaryButton from "../common/PrimaryButton";
import trashIcon from "../../assets/images/trash-icon.png";
import { AnimatePresence, motion } from "framer-motion";
import { deletePrediction } from "../../services/predictions";
import { deletePatient } from "../../services/predictions";

export default function OverviewContainer({
  predictionData,
  patientData,
  isPrediction,
  enableOverview,
  viewAllPatientPredictions,
  handelGoToDashboard,
}) {
  const contributingFactors = predictionData?.explanationText || {};
  const contributingFactorsArray = Object.entries(contributingFactors).map(
    ([key, value]) => ({ key, value })
  );
  const riskBackgroundColor = (riskLevel) => {
    if (riskLevel === "HIGH") {
      return "bg-red-500";
    } else if (riskLevel === "MEDIUM") {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };
  contributingFactorsArray.sort((a, b) => b.value - a.value);

  
  async function handleDeletePrediction() {
    let userConfirmed = confirm("Are you sure you want to proceed?");

    if (userConfirmed) {
      if (isPrediction) {
        await deletePrediction(predictionData.predictionId);
        alert("Prediction deleted successfully!");
      } else {
        await deletePatient(patientData.patientId);
        alert("Patient deleted successfully!");
      }
      // Refresh the entire page
      window.location.reload();
    }
  }
  const data = isPrediction ? predictionData : patientData;
  const timestamp = data?.timestamp || null;
  const dateObj = timestamp ? new Date(timestamp) : null;
  const date = dateObj ? dateObj.toISOString().split("T")[0] : "N/A";
  const time = dateObj
    ? dateObj.toTimeString().split(" ")[0].slice(0, 5)
    : "N/A";
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: -7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-row border rounded-2xl items-center justify-between px-6 py-2"
      >
        {isPrediction && (
          <PredictionInfo titleBottom={false} title={"Patient ID"}>
            <span className="text-lg font-semibold text-secondary">
              {predictionData.patientId}
            </span>
          </PredictionInfo>
        )}
        <PredictionInfo title={"Risk level"}>
          <div className={`rounded-full p-4 ${
              isPrediction
                ? riskBackgroundColor(predictionData.riskLevel)
                : "bg-gray-400" // Default color if no prediction
            }`}
          />
          <span>{isPrediction ? predictionData.riskLevel : "Undefined"}</span>
        </PredictionInfo>
        {!isPrediction && (
          <PredictionInfo title={"Patient ID"}>
            <h3 className=" text-primary">{patientData.patientId}</h3>
          </PredictionInfo>
        )}
        {isPrediction && (
          <PredictionInfo title={"Risk score"}>
            <span className="text-2xl">{predictionData.riskScore+'%'}</span>
          </PredictionInfo>
        )}
        <PredictionInfo title={isPrediction ? "Date" : "Birth Date"}>
          <img src={calendaricon} alt="Icon" className="w-1/4" />
          <span>{isPrediction ? date : patientData.birthDate}</span>
        </PredictionInfo>
        <PredictionInfo title={isPrediction ? "Time" : "Pregnancy Date"}>
          <img src={calendaricon} alt="Icon" className="w-1/4" />
          <span>{isPrediction ? time : patientData.pregnancyDate}</span>
        </PredictionInfo>
        {isPrediction && (
          <PredictionInfo titleBottom={false} title={"Key factors"}>
            {contributingFactorsArray.slice(0, 2).map((factor) => (
              <span className="text-center" key={factor.key}>{factor.key}</span>
            ))}
            <PrimaryButton className={"scale-50 p-2"} animate={false}>
              View all
            </PrimaryButton>
          </PredictionInfo>
        )}
        <PredictionInfo
          title={"Delete"}
          className={"cursor-pointer hover:bg-background rounded-full transition-all duration-200 py-2"}
          onClick={() => handleDeletePrediction()}
        >
          <img src={trashIcon} alt="trash icon" className="w-1/5" />
        </PredictionInfo>
        <div className="flex flex-col scale-75 gap-2 -mr-3">
          <PrimaryButton className={"text-nowrap"}
            onClick={isPrediction ? enableOverview : viewAllPatientPredictions}
          >
            {isPrediction ? "View more details" : "View all predictions"}
          </PrimaryButton>
          <PrimaryButton transparent={true} onClick={handelGoToDashboard} className={"text-nowrap"}>
            Go to dashboard
          </PrimaryButton>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
