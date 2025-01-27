import PrimaryContainer from "../layout/PrimaryContainer";
import { healthFactors } from "../../assets/data/data";
import FactorDetails from "./FactorDetails";

export default function ListOfFactors() {
  return (
    <PrimaryContainer className="!gap-0 w-2/5">
      <span className="text-2xl pb-4">List of factors</span>
      <FactorDetails main={true} {...healthFactors.biggestFactor} />
      {healthFactors.otherFactors.map((factor) => (
        <FactorDetails key={factor.title} {...factor} />
      ))}
    </PrimaryContainer>
  );
}
