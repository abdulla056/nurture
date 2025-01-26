import CustomLine from "../components/common/CustomLine";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import OverviewButton from "../components/overview/OverviewButton";
import PredictedCauseSection from "../components/overview/PredictedCauseSection";
import RiskScore from "../components/overview/RiskScore";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Overview() {
  return (
    <div className="flex flex-col gap-8">
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
          <PrimaryContainer className="row-span-2">
            fakjsdbfdskjfbakdjsfbkjdsfbkjbkj
          </PrimaryContainer>
        </div>
      </div>
    </div>
  );
}
