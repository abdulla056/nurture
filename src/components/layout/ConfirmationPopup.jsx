import { forwardRef } from "react";
import PopUpButton from "../common/PopUpButton";

const ConfirmationPopup = forwardRef(function ConfirmationPopup(
  { className = "", firstButton, secondButton },
  ref
) {
  return (
    <dialog
      ref={ref}
      className={`popup-container rounded-xl px-12 py-12${className}`}
    >
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center">
          <h3 className="text-font">
            Recommendation has been tracked successfully
          </h3>
          <span className="text-sm text-font">
            This recommendation will be used to improve the model and provide
            better results
          </span>
        </div>
        <div className="flex flex-col gap-2">

          <PopUpButton>{firstButton}</PopUpButton>
          {secondButton && (
            <PopUpButton transparent={true}>{secondButton}</PopUpButton>
          )}
          {/* <form method="dialog">
          <PrimaryButton className={"text-xl"}>fnajksfnjk</PrimaryButton>
        </form> */}
        </div>
      </div>
    </dialog>
  );
});

export default ConfirmationPopup;
