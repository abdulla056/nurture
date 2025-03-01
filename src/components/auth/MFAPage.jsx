import { useRef, useState, useEffect } from "react";
import PrimaryContainer from "../layout/PrimaryContainer";
import { Lock } from "@mui/icons-material";
import PrimaryButton from "../common/PrimaryButton";

length = 6;

export default function MFAPage(tempToken, uid, onSuccess, onError) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [confirmationResult, setConfirmationResult] = useState(null); // State for confirmation result
  const inputRefs = Array(length)
    .fill(null)
    .map(() => useRef(null));

  const sendVerificationCode = async () => {
    try {
      setErrorMessage("");
      const res = await api.post("/auth/send-verification-code", { tempToken });
      setConfirmationResult(res.data.confirmationResult);
    } catch (error) {
      setErrorMessage("Failed to send verification code.");
      onError("Failed to send verification code.");
    }
  };

  // Handles input change
  const handleChange = (index, event) => {
    const value = event.target.value;

    // Check if the value is a number
    if (!/^\d$/.test(value)) {
      setErrorMessage("Only numbers are allowed.");
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs[index + 1].current.focus();
    }
    // Clear error message if input is valid
    setErrorMessage("");
  };

  const handleKeyDown = (index, event) => {
    const key = event.key;
    if (key === "Backspace" || key === "Delete") {
      if (!otp[index] && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    } else if (!/^\d$/.test(key)) {
      // Show error message for invalid keys
      setErrorMessage("Only numbers are allowed.");
      event.preventDefault(); // Prevent the invalid key from being entered
    } else {
      // Clear error message if the key is valid
      setErrorMessage("");
    }
  };
  // Verify the OTP
  const verifyOtp = async () => {
    try {
      setErrorMessage("");

      if (!confirmationResult) {
        setErrorMessage("Verification code not sent.");
        return;
      }

      const code = otp.join("");
      const res = await api.post("/auth/verify-otp", {
        confirmationResult,
        otp: code,
        tempToken,
      });
      // Notify the parent component of success
      onSuccess();

    } catch (error) {
      setErrorMessage("Invalid verification code.");
      onError = "Invalid verification code.";
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
      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
      <span className="w-full text-center">
        Didn't get the code?{" "}
        <span className="text-secondary font-semibold hover:cursor-pointer" onClick={sendVerificationCode}>
          Resend code
        </span>
      </span>
      <PrimaryButton onClick={verifyOtp}>Verify account</PrimaryButton>
    </PrimaryContainer>
  );
}
