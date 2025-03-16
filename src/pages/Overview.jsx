import CustomLine from "../components/common/CustomLine";
import PredictionDetails from "../components/common/PredictionDetails";
import BlueContainer from "../components/layout/BlueContainer";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import PredictedCauseSection from "../components/overview/PredictedCauseSection";
import RiskScore from "../components/overview/RiskScore";
import PregnancyDetails from "../components/overview/PregnancyDetails";
import HoveringButton from "../components/overview/HoveringButton";
import PastPredictions from "../components/overview/PastPredictions";
import HeadingSection from "../components/common/HeadingSection";
import { predictionDetails } from "../assets/data/data";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-8 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <HeadingSection />
        <div className="flex flex-row justify-between" id="mainSection">
          <PredictedCauseSection />
          <div className="grid grid-flow-col grid-rows-2 gap-6 grid-cols-2">
            <RiskScore />
            <RiskScore isConfidence={true} />
            <PrimaryContainer
              className="row-span-2 items-start"
              id="predictionDetails"
              disableHover={false}
            >
              <span className="text-2xl text-font">Prediction Details</span>
              <BlueContainer className="grid grid-cols-2 grid-rows-2 gap-6 py-6">
                {predictionDetails.map((prediction, index) => (
                  <PredictionDetails
                    key={index}
                    icon={prediction.icon}
                    title={prediction.title}
                    data={prediction.data}
                  />
                ))}
              </BlueContainer>
              <CustomLine />
              <span className="text-2xl text-font">Pregnancy Details</span>
              <PregnancyDetails
                data={"Second"}
                title={"Trimester"}
                description={"Giving birth in 15 weeks"}
              />
              <PregnancyDetails
                data={"Normal"}
                title={"Gestational"}
                description={"Birth at 38-42 weeks"}
              />
            </PrimaryContainer>
          </div>
        </div>
        <PastPredictions />
        <HoveringButton onClick={() => navigate("/dashboard/analysis") }>See detailed analysis</HoveringButton>
      </motion.div>
    </AnimatePresence>
  );
}
