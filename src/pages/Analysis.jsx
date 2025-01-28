import PredictionExplanation from "../components/analysis/PredictionExplanation";
import HeadingSection from "../components/common/HeadingSection";
import ListOfFactors from "../components/analysis/ListOfFactors";
import PredictionCause from "../components/common/PredictionCause";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Analysis() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <HeadingSection overview={false} patient={patient} />
      <PredictionCause patient={patient} overview={false}/>
      <div className="flex flex-row w-full gap-8">
        <ListOfFactors/>
        <PredictionExplanation/>
      </div>
    </div>
  );
}
