import selectIconWhite from "../../assets/images/tick-icon.png"
import selectIconBlack from "../../assets/images/tick-icon-black.png"

export default function CurrentCaseDataSelector({onPress, isSelected, children}) {
  return (
    <div onClick={onPress}
      className={`flex flex-row rounded-lg p-4 justify-between transition-all duration-150 hover:brightness-95 ${
        isSelected ? "bg-primary" : "bg-background"
      }`}
    >
      <span className={isSelected ? "text-white" : "text-font"}>{children}</span>
      <img src={isSelected ? selectIconWhite : selectIconBlack} alt="" className={`w-6 rounded-sm p-1 ${isSelected ? "bg-secondary" : "bg-white"}`}/>
    </div>
  );
}
