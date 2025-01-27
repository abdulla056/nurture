import PrimaryContainer from "../layout/PrimaryContainer";
import { healthFactors } from "../../assets/data/data";
import FactorDetails from "./FactorDetails";
import PrimaryButton from "./PrimaryButton";
import CustomLine from "./CustomLine"

export default function ListOfFactors() {
  return (
    <PrimaryContainer className="!gap-0 w-2/5">
      <span className="text-2xl pb-4">List of factors</span>
      <FactorDetails main={true} {...healthFactors.biggestFactor} />
      {healthFactors.otherFactors.map((factor) => (
        <FactorDetails key={factor.title} {...factor} />
      ))}
      <CustomLine className={"-mx-6 w-auto"}/>
      <PrimaryButton className="mx-20 mt-4">See all factors</PrimaryButton>
    </PrimaryContainer>
  );
}
