import PrimaryContainer from "../layout/PrimaryContainer";
import { healthFactors } from "../../assets/data/data";
import FactorDetails from "../common/FactorDetails";
import PrimaryButton from "../common/PrimaryButton";
import CustomLine from "../common/CustomLine"
import {useContext} from "react";
import { PredictionDetailsContext } from "../../store/prediction-details-context";

export default function ListOfFactors() {
  const predictionDetails  = useContext(PredictionDetailsContext);
  const contributingFactors  = predictionDetails?.contributingFactors;
  console.log(contributingFactors)
  return (
    <PrimaryContainer className="!gap-0 w-2/5 hover:scale-100">
      <span className="text-2xl pb-4">List of factors</span>
      <FactorDetails main={true} {...healthFactors.biggestFactor} />
      {healthFactors.otherFactors.map((factor) => (
        <FactorDetails key={factor.title} {...factor} />
      ))}
      <CustomLine className={"-mx-6 !w-auto"}/>
      <PrimaryButton className="mx-20 mt-4">See all factors</PrimaryButton>
    </PrimaryContainer>
  );
}
