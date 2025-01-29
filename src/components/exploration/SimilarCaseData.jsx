import PrimaryContainer from "../layout/PrimaryContainer";
import PrimaryButton from "../common/PrimaryButton";
import CustomDropDown from "../common/CustomDropDown";
import LineChart from "./LineChart";

const dropDownData = [
  {
    title: "Selecting based on:",
    options: ["Maternal age", "bullshit", "more bullshit"],
  },
  {
    title: "View:",
    options: ["Crazy view", "Unreal View", "Majestic View"],
  },
];

export default function SimilarCaseData() {
  return (
    <PrimaryContainer className="w-5/12 !p-7">
      <h2>Similar Case Data</h2>
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-row gap-5 w-9/12">
          {dropDownData.map((dropDown) => (
            <CustomDropDown {...dropDown} />
          ))}
        </div>
        <PrimaryButton className={"h-2/3"}>Go</PrimaryButton>
      </div>
      <LineChart />
    </PrimaryContainer>
  );
}
