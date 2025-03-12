import { forwardRef } from "react";
import PrimaryButton from "../common/PrimaryButton";

const PopUp = forwardRef(function ConfirmationPopup(
  { className = "", children, isOpen, ...props},
  ref
) {
  return (
    <dialog
      ref={ref}
      isOpen = {isOpen}
      {...props}
      className={`popup-container rounded-xl px-12 py-12${className}`}
    >
      <div className="flex flex-col items-center gap-12">
        {children}
      </div>
    </dialog>
  );
});

export default PopUp;