import HeadingSection from "../components/common/HeadingSection";
import ListOfFactors from "../components/common/ListOfFactors";
import PredictionCause from "../components/common/PredictionCause";
import PrimaryContainer from "../components/layout/PrimaryContainer";

const patient = { id: "RSW31213", cause: "Congenital syphilis" };

export default function Analysis() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <HeadingSection overview={false} patient={patient} />
      <PredictionCause patient={patient} overview={false}/>
      <div className="flex flex-row w-full">
        <ListOfFactors/>
      </div>
    </div>
  );
}
