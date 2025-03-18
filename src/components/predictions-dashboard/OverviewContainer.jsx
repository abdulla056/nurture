import PredictionInfo from "./PredictionInfo";
import calendaricon from "../../assets/images/calendar-black.png";
import PrimaryButton from "../common/PrimaryButton";
import trashIcon from "../../assets/images/trash-icon.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { deletePrediction } from "../../services/predictions";

const keyFactors = ["Maternal age", "Gestational diabetes"];

export default function OverviewContainer({
  predictionData,
  patientData,
  isPrediction,
  enableOverview,
  viewAllPatientPredictions,
  handelGoToDashboard,
}) {
  async function handleDeletePrediction() {
    let userConfirmed = confirm("Are you sure you want to proceed?");
    
    if (userConfirmed) {
        await deletePrediction(predictionData.predictionId);
        alert("Prediction deleted successfully!");
    } else {
        alert("Action canceled!");
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
          <div>Indicator</div>
          <span>{isPrediction ? predictionData.riskLevel : "Low"}</span>
        </PredictionInfo>
        {!isPrediction && (
          <PredictionInfo title={"Patient ID"}>
            <h3 className=" text-primary">{patientData.patientId}</h3>
          </PredictionInfo>
        )}
        {isPrediction && (
          <PredictionInfo title={"Risk score"}>
            <span className="text-2xl">{predictionData.riskScore}</span>
          </PredictionInfo>
        )}
        <PredictionInfo title={isPrediction ? "Date" : "Birth Date"}>
          <img src={calendaricon} alt="Icon" className="w-1/4" />
          <span>{date}</span>
        </PredictionInfo>
        <PredictionInfo title={isPrediction ? "Time" : "Pregnancy Date"}>
          <img src={calendaricon} alt="Icon" className="w-1/4" />
          <span>{time}</span>
        </PredictionInfo>
        {isPrediction && (
          <PredictionInfo titleBottom={false} title={"Key factors"}>
            {keyFactors.map((factor, index) => (
              <span key={index}>{factor}</span>
            ))}
            <PrimaryButton className={"scale-50 p-2"} animate={false}>
              View all
            </PrimaryButton>
          </PredictionInfo>
        )}
        <PredictionInfo title={"Delete"} className={"cursor-pointer"} onClick={()=>handleDeletePrediction()}>
          <img src={trashIcon} alt="trash icon" className="w-1/5" />
        </PredictionInfo>
        <div className="flex flex-col scale-75 gap-2 -mr-3">
          <PrimaryButton onClick={isPrediction ? enableOverview : viewAllPatientPredictions}>
            {isPrediction ? "View more details" : "View all predictions"}
          </PrimaryButton>
          <PrimaryButton
            transparent={true}
            onClick={handelGoToDashboard}
          >
            Go to dashboard
          </PrimaryButton>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
