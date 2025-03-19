import PrimaryContainer from "../layout/PrimaryContainer";
import { healthFactors } from "../../assets/data/data";
import FactorDetails from "../common/FactorDetails";
import PrimaryButton from "../common/PrimaryButton";
import CustomLine from "../common/CustomLine";
import { useContext } from "react";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import LoadingSpinner from "../common/LoadingSpinner";

export default function ListOfFactors() {
  const { contributingFactors } = useContext(PredictionDetailsContext);
  if (!contributingFactors) {
    return ( 
      <div style={{ paddingTop: '50px' }}> {/* Adjust the value as needed */}
        <LoadingSpinner />
      </div> // Show a loading spinner or message
      )
  }
  const contributingFactorsArray = Object.entries(contributingFactors).map(([key, value]) => ({ key, value }));
  contributingFactorsArray.sort((a, b) => b.value - a.value);
  const biggestFactor = contributingFactorsArray[0];
  const otherFactors = contributingFactorsArray.slice(1);
  return (
    <PrimaryContainer className="!gap-0 w-2/5 hover:scale-100">
      <span className="text-2xl pb-4">List of factors</span>
      <FactorDetails main={true} title={biggestFactor.key} percentage={biggestFactor.value}/>
      {otherFactors.map((factor) => (
        <FactorDetails key={factor.key} title={factor.key} percentage={factor.value} />
      ))}
      <CustomLine className={"-mx-6 !w-auto"} />
      <PrimaryButton className="mx-20 mt-4">See all factors</PrimaryButton>
    </PrimaryContainer>
  );
}
