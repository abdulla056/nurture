import CustomLine from "../components/common/CustomLine";
import PredictionDetails from "../components/common/PredictionDetails";
import BlueContainer from "../components/layout/BlueContainer";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import OverviewButton from "../components/overview/OverviewButton";
import PredictedCauseSection from "../components/overview/PredictedCauseSection";
import RiskScore from "../components/overview/RiskScore";
import calendarIcon from "../assets/images/calendar.png";
import PregnancyDetails from "../components/overview/PregnancyDetails";
import DetailedAnalysisButton from "../components/overview/DetailedAnalysisButton";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Overview() {
  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-primary font-medium">SUMMARY</h1>
        <OverviewButton>See all predicted results</OverviewButton>
        <div className="flex flex-row">
          <h3 className="text-font">Patient ID:</h3>
          <h3 className="text-secondary">{patient.id}</h3>
        </div>
      </div>
      <CustomLine />
      <div className="flex flex-row justify-between" id="mainSection">
        <PredictedCauseSection patient={patient} />
        <div className="grid grid-flow-col grid-rows-2 gap-6 grid-cols-2">
          <RiskScore />
          <RiskScore />
          <PrimaryContainer className="row-span-2 items-start" id="predictionDetails">
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
            <CustomLine/>
            <span className="text-2xl text-font">Pregnancy Details</span>
            <PregnancyDetails data={"Second"} title={"Trimester"} description={"Giving birth in 15 weeks"}/>
            <PregnancyDetails data={"Normal"} title={"Gestational"} description={"Birth at 38-42 weeks"}/>
          </PrimaryContainer>
        </div>
      </div>
      <DetailedAnalysisButton/>
    </div>
  );
}
