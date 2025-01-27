import InfoButton from "../common/InfoButton";
import VerticalLine from "../common/VerticalLine";
import PrimaryContainer from "../layout/PrimaryContainer";
import DonutChart from "./DonutChart";
import {performanceData} from "../../assets/data/data"

export default function ModelPerformance() {
  return (
    <div className="flex flex-col items-end gap-4">
      <span className="text-regular text-font-tertiary font-semibold mb-2 w-full">
        Model Performance
      </span>
      <PrimaryContainer className="!flex-row items-center justify-between w-full">
        {performanceData.map((data, index) => (
          <>
            <DonutChart {...data} key={index} index={index} />
            <VerticalLine key={index*40}/>
          </>
        ))}
      </PrimaryContainer>
      <div className="flex flex-row gap-2">
            <span className="text-regular text-font-tertiary">CNN Model Version 3.21</span>
            <InfoButton/>
        </div>
    </div>
  );
}
