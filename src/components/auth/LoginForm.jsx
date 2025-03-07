import TextField from "../common/TextField";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import Logo from "../common/Logo";
import * as yup from 'yup';
import { useState } from 'react';

const schema = yup.object().shape({
  emailAddress: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const sanitizeInput = (input) => {
  return input.trim(); // Trim whitespace
};

const sanitizeEmail = (email) => {
  return sanitizeInput(email).toLowerCase(); // Trim and convert to lowercase
};

const sanitizePassword = (password) => {
  return sanitizeInput(password); // Trim whitespace
};

export default function LoginForm({ togglePage,  onLogin, error, success }) {
  
  const [formData, setFormData] = useState({
      emailAddress: '',
      password: '',
  }); // Store form data
  
  const sanitizedData = {
    emailAddress: sanitizeEmail(formData.emailAddress),
    password: sanitizePassword(formData.password),
  };

  const [formErrors, setFormErrors] = useState({}); // Store validation errors

  const handleFormDataChange = (newValue, id) => {
    setFormData({ ...formData, [id]: newValue });  // Update state
    setFormErrors({ ...formErrors, [id]: "" }); // Clear error for the specific field when changed
  };

  const handleSubmit = async (event) => { // Handles form submission
    event.preventDefault(); // Prevent page refresh!'
    console.log("starting")
    try {
      console.log(formData);
      const validatedData = await schema.validate(formData, { abortEarly: false });// Validate with yup
      console.log("Validated Data:", validatedData);
      setFormErrors({}); // Clear all errors if validation passes
      onLogin(formData); // Call API if validation is successful

    } catch (validationError) {
      console.error("Full Validation Error Object:", validationError); // Log for debugging

      if (validationError && validationError.inner && Array.isArray(validationError.inner)) { // Check if inner exists and is an array
        const errors = {};
        validationError.inner.forEach(err => {
          if (err.path && err.message) { // Check if path and message exist
            errors[err.path] = err.message;
          } else {
            console.warn("Error object missing path or message:", err); // Log if data is missing
          }
        });
        setFormErrors(errors);
        console.log("Form Errors:", errors);
      } else {
        console.error("Unexpected Validation Error Format:", validationError);
        setFormErrors({ general: "An unexpected error occurred." }); // Generic error
      }
    }
  };
  
  return (
    <div className="flex flex-col rounded-none min-w-[240px] w-[561px] max-md:max-w-full">
      <div className="flex z-10 flex-col items-center px-9 py-8 w-full bg-white rounded-3xl border border-solid border-neutral-300 shadow-[0px_0px_40px_rgba(0,0,0,0.12)] max-md:px-5 max-md:max-w-full" onSubmit={handleSubmit}>
        <Logo color={"black"}/>
        <div className="flex flex-col max-w-full w-[393px]">
          <h1 className="text-2xl font-semibold text-center text-black">
            Sign in to Nurture
          </h1>
          <p className="mt-2 text-lg text-zinc-500 text-regular">
            Welcome back! Please sign in to continue
          </p>
        </div>
        <form className="flex flex-col mt-12 w-full text-base font-semibold text-black max-w-[490px] max-md:mt-10 max-md:max-w-full">
          <TextField
            label={"Email Address"}
            id={"emailAddress"}
            type={"email"}
            formDataChanged={handleFormDataChange}
            value={formData.emailAddress}
            error={formErrors.emailAddress}
          ></TextField>
          <TextField
            label={"Password"}
            id={"password"}
            type={"password"}
            formDataChanged={handleFormDataChange}
            value={formData.password}
            error={formErrors.password}
          ></TextField>
          <SecondaryButton type="submit"> Continue </SecondaryButton>
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error from parent */}
          {success && <p className="text-green-500 mt-2">{success}</p>} {/* Display success from parent */}
        </form>
      </div>
      <div className="gap-2.5 px-36 pt-20 pb-6 -mt-14 text-lg bg-white rounded-3xl min-h-[132px] text-sky-950 max-md:px-5 max-md:mt-10">
        Don't have an account?{" "}
        <span
          className="font-bold text-primary hover:cursor-pointer"
          onClick={togglePage}
        >
          Sign in
        </span>
      </div>
    </div>
  );
}
