import CustomLine from "../components/common/CustomLine";
import PredictionDetails from "../components/common/PredictionDetails";
import BlueContainer from "../components/layout/BlueContainer";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import PredictedCauseSection from "../components/overview/PredictedCauseSection";
import RiskScore from "../components/overview/RiskScore";
import calendarIcon from "../assets/images/calendar.png";
import PregnancyDetails from "../components/overview/PregnancyDetails";
import DetailedAnalysisButton from "../components/overview/DetailedAnalysisButton";
import PastPredictions from "../components/overview/PastPredictions";
import HeadingSection from "../components/common/HeadingSection";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Overview() {
  return (
    <div className="flex flex-col gap-8 relative">
      <HeadingSection patient={patient}/>
      <div className="flex flex-row justify-between" id="mainSection">
        <PredictedCauseSection patient={patient} />
        <div className="grid grid-flow-col grid-rows-2 gap-6 grid-cols-2">
          <RiskScore />
          <RiskScore />
          <PrimaryContainer
            className="row-span-2 items-start"
            id="predictionDetails"
          >
            <span className="text-2xl text-font">Prediction Details</span>
            <BlueContainer className="grid grid-cols-2 grid-rows-2 gap-6 py-6">
              <PredictionDetails
                icon={calendarIcon}
                title={"Date"}
                data={"26th January 2024"}
              />
              <PredictionDetails
                icon={calendarIcon}
                title={"Time"}
                data={"17:32:21"}
              />
              <PredictionDetails
                icon={calendarIcon}
                title={"Expected Delivery"}
                data={"26th January 2024"}
              />
              <PredictionDetails
                icon={calendarIcon}
                title={"Prediction Model"}
                data={"Resnet"}
              />
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
      <PastPredictions/>
      <DetailedAnalysisButton />
    </div>
  );
}
