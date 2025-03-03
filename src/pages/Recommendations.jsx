import PrimaryContainer from "../components/layout/PrimaryContainer";
import OptionsPicker from "../components/recommendation/OptionsPicker";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/common/PrimaryButton";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
// import {useForm} from "react-hook-form";

export default function Recommendations() {
  const dialog = useRef();
  const [formData, setFormData] = useState({
    easeOfUse: "",
    intuitiveUI: "",
    userInterfaceImprovement: "",
    accuracy: "",
    additionalFeatures: "",
    improvements: "",
  });

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    dialog.current.showModal();
    // Here you can add the API call to submit the form data
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <PrimaryContainer disableHover={true}>
          <ConfirmationPopup
            ref={dialog}
            firstButton="Go to dashboard"
            title={"Recommendation has been tracked successfully"}
            description={
              "This recommendation will be used to improve the model and provide better results"
            }
          />
          <form className="flex flex-col gap-2 items-center">
            <OptionsPicker
              onChange={(value) => handleChange("easeOfUse", value)}
              name={"easeOfUse"}
            >
              How easy is the system to use?
            </OptionsPicker>
            <OptionsPicker
              onChange={(value) => handleChange("intuitiveUI", value)}
              name={"intuitiveUI"}
            >
              How intuitive is the user interface?
            </OptionsPicker>
            <TextField
              formDataChanged={(value) =>
                handleChange("userInterfaceImprovement", value)
              }
              id={"userInterfaceImprovement"}
              type={"text"}
              label={"Any suggestions for improving the user interface?"}
            />
            <OptionsPicker
              onChange={(value) => handleChange("accuracy", value)}
              name={"accuracy"}
            >
              How accurate are the predictions based on your medical expertise?
            </OptionsPicker>
            <TextField
              formDataChanged={(value) =>
                handleChange("additionalFeatures", value)
              }
              id={"additionalFeatures"}
              type={"text"}
              label={"What additional features would you like to see?"}
            />
            <TextField
              formDataChanged={(value) => handleChange("improvements", value)}
              id={"improvements"}
              type={"text"}
              label={
                "What improvements would make this system more suitable for clinical practice? "
              }
            />
            <PrimaryButton
              className={"my-8 w-1/4 shadow-2xl !py-4 hover:scale-105"}
              onClick={handleSubmit}
              type={"button"}
            >
              Submit
            </PrimaryButton>
          </form>
        </PrimaryContainer>
      </motion.div>
    </AnimatePresence>
  );
}
