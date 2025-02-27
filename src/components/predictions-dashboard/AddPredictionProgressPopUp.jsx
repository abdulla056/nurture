import { forwardRef, useEffect, useState } from "react";
import { steps } from "../../assets/data/add-prediction";
import PopUp from "../layout/PopUp";
import PrimaryButton from "../common/PrimaryButton";
import { useNavigate } from "react-router-dom";

const AddPredictionProgressPopUp = forwardRef(
  function AddPredictionProgressPopUp({ isOpen }, ref) {
    const [activeStep, setActiveStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isOpen) {
        setActiveStep(0); // Reset progress when popup closes
        return;
      }
      if (activeStep >= steps.length) return; // Stop at the last step

      const timer = setInterval(() => {
        setActiveStep((prev) => prev + 1);
      }, 2000);

      if (activeStep === steps.length - 1) {
        setTimeout(() => {
          setIsFinished(true);
        }, 2000);
      }

      return () => clearInterval(timer);
    }, [activeStep, isOpen]);

    return (
      <PopUp ref={ref}>
        <div className="flex flex-col items-start">
          {steps.map((step, index) => (
            <AddPredictionProgressBar
              step={step}
              key={index}
              active={activeStep === index}
              finished={activeStep > index}
              index={index}
            />
          ))}
          <div className="w-full flex justify-center pt-8">
            <PrimaryButton
              isActive={isFinished}
              animate={isFinished ? true : false}
              onClick={isFinished ? () => navigate("/dashboard") : null}
            >
              Go to dashboard
            </PrimaryButton>
          </div>
        </div>
      </PopUp>
    );
  }
);

export default AddPredictionProgressPopUp;

function AddPredictionProgressBar({ step, active, finished, index }) {
  return (
    <div className="flex flex-row w-full px-4 items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full p-1 transition-all duration-200 ease-in-out ${
            finished
              ? "bg-transparent"
              : active
              ? "bg-background"
              : "bg-transparent"
          }`}
        >
          <div
            className={`rounded-full p-4 border transition-all duration-200 ${
              finished
                ? "border-primary bg-primary"
                : active
                ? "bg-white  border-primary"
                : "bg-white"
            }`}
          >
            <div
              className={`rounded-full p-2 transition-all duration-200 ${
                finished ? "bg-white" : active ? "bg-primary" : "bg-gray-400"
              }`}
            />
          </div>
        </div>
        {index !== 3 && (
          <div
            className={`h-12 w-1 transition-all duration-200 ${
              finished ? "bg-primary" : "bg-gray-400"
            }`}
          />
        )}
      </div>
      <div
        className={`flex flex-col gap-1 pt-2 transition-all duration-200 border border-transparent group rounded-xl hover:bg-gray-50 hover:border-gray-200 hover:cursor-default w-full py-6 px-6`}
      >
        <h3
          className={`text-font text-2xl ${
            !finished && !active && "text-gray-300"
          }`}
        >
          {step.title}
        </h3>
        <span
          className={`text-font-tertiary ${
            !finished && !active && "text-gray-200"
          }`}
        >
          {step.description}
        </span>
      </div>
    </div>
  );
}
