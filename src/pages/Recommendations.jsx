import PrimaryContainer from "../components/layout/PrimaryContainer";
import OptionsPicker from "../components/recommendation/OptionsPicker";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/common/PrimaryButton";
import { useRef } from "react";
import ConfirmationPopup from "../components/layout/ConfirmationPopup";
import { AnimatePresence, motion } from "framer-motion";

export default function Recommendations() {
  const dialog = useRef();
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
            <OptionsPicker>Please rate our system accuracy:</OptionsPicker>
            <TextField
              id={"something"}
              type={"text"}
              label={"Placeholder question"}
            />
            <OptionsPicker>Placeholder question</OptionsPicker>
            <TextField
              id={"something"}
              type={"text"}
              label={"Placeholder question"}
            />
            <TextField
              id={"something"}
              type={"text"}
              label={"Placeholder question"}
            />
            <PrimaryButton
              className={"my-8 w-1/4 shadow-2xl !py-4 hover:scale-105"}
              onClick={() => dialog.current.showModal()}
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
