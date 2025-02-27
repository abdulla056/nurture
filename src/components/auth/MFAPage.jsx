import { useRef, useState } from "react";
import PrimaryContainer from "../layout/PrimaryContainer";
import { Lock } from "@mui/icons-material";
import PrimaryButton from "../common/PrimaryButton";

length = 6;

export default function MFAPage() {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = Array(length)
    .fill(null)
    .map(() => useRef(null));

  const handleChange = (index, event) => {
    const value = event.target.value;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  return (
    <PrimaryContainer className="!p-12 !gap-8 mt-12">
      <div className="p-3 bg-background w-fit rounded-lg">
        <Lock />
      </div>
      <div>
        <h3 className="font-light text-font">Authentication</h3>
        <span className="text-font-tertiary">
          Enter your multi factor authentication code
        </span>
      </div>
      <div className="flex flex-row gap-6">
        {otp.map((value, index) => (
          <input
            className="border rounded-lg border-gray-300 focus:outline-none size-20 text-center text-2xl focus:border-primary focus:border-2"
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>
      <span className="w-full text-center">
        Didn't get the code?{" "}
        <span className="text-secondary font-semibold hover:cursor-pointer">
          Resend code
        </span>
      </span>
      <PrimaryButton>Verify account</PrimaryButton>
    </PrimaryContainer>
  );
}
