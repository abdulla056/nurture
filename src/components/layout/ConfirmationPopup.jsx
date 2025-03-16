import { forwardRef } from "react";
import PrimaryButton from "../common/PrimaryButton";

const ConfirmationPopup = forwardRef(function ConfirmationPopup(
  { className = "", firstButton, secondButton, title, description, actionFirstButton, actionSecondButton },
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
            {title}
          </h3>
          <span className="text-sm text-font">
            {description}
          </span>
        </div>
        <div className="flex flex-col gap-2">

          <PrimaryButton onClick={actionFirstButton}>{firstButton}</PrimaryButton>
          {secondButton && (
            <PrimaryButton onClick={actionSecondButton} transparent={true}>{secondButton}</PrimaryButton>
          )}
        </div>
      </div>
    </dialog>
  );
});

export default ConfirmationPopup;
