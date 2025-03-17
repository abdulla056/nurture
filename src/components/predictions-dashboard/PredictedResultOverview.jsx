import PrimaryButton from "../common/PrimaryButton";
import PrimaryContainer from "../layout/PrimaryContainer";
import CustomLine from "../common/CustomLine";
import PredictionDetails from "../common/PredictionDetails";
import BlueContainer from "../layout/BlueContainer";
import { predictionDetails } from "../../assets/data/data";
import PredictionOverviewSection from "./PredictionOverviewSection";
import VerticalLine from "../common/VerticalLine";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RiskScore from "../overview/RiskScore";
import { useContext } from "react";
import { PredictionSelectorContext } from "../../store/prediction-selector-context";

export default function PredictedResultOverview({
  isActive = true,
  prediction,
}) {
  const navigate = useNavigate();
  console.log(prediction);
  const { setPrediction } = useContext(PredictionSelectorContext);
  const handelGoToDashboard = () => {
    setPrediction(prediction.predictionId);
    navigate("/dashboard");
  }
  const timestamp = prediction?.timestamp || null;
  const dateObj = timestamp ? new Date(timestamp) : null;
  const date = dateObj ? dateObj.toISOString().split("T")[0] : "N/A";
  const time = dateObj
  return (
    <PrimaryContainer
      className={
        isActive ? "w-4/5" : "custom-width items-center justify-center"
      }
    >
      <AnimatePresence>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full gap-6 p-2 flex flex-col"
          >
            <div className="flex flex-row justify-between items-center">
              <h2 className="font-medium">
                Predicted Result {prediction.detailId}
              </h2>
              <PrimaryButton
                className={"scale-90 text-lg"}
                animate={false}
                onClick={() => handelGoToDashboard()}
              >
                Click to see patient dashbaord
              </PrimaryButton>
            </div>
            <CustomLine />
            <BlueContainer className="!flex !flex-row justify-between !px-10 py-6">
              {predictionDetails.map((prediction, index) => (
                <PredictionDetails
                  key={index}
                  icon={prediction.icon}
                  title={prediction.title}
                  data={prediction.data}
                />
              ))}
            </BlueContainer>
            <div className="flex flex-row gap-12">
              <PredictionOverviewSection
                title={"Risk Score"}
                description={
                  "See how much risk the patient is under based on our predictions"
                }
              >
                <RiskScore riskScore={prediction.riskScore} />
              </PredictionOverviewSection>
              <VerticalLine />
              <PredictionOverviewSection
                title={"Lime Explanation"}
                description={"See what features impact the prediction the most"}
              >
                <img
                  src={`data:image/png;base64,${prediction.explanation_image}`}
                  alt=""
                />
              </PredictionOverviewSection>
            </div>
          </motion.div>
        ) : (
          <motion.span
            className="text-font-tertiary text-center"
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Please select a result to view more details
          </motion.span>
        )}
      </AnimatePresence>
    </PrimaryContainer>
  );
}
