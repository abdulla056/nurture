import * as React from "react";
import TextField from "../common/TextField";
import SecondaryButton from "./SecondaryButton";
import axios from "axios"; // Import axios
import { useForm } from 'react-hook-form'; // Import react-hook-form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

// Validates the inputs
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only letters and spaces"
    ),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only letters and spaces"
    ),

  emailAddress: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  doctorLicense: yup
    .string()
    .required("Doctor license is required")
    .min(2, "Doctor license must be at least 2 characters")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Only letters, numbers, and spaces, no special characters"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Required at least a uppercase, a lowercase, a number, and a special character"
    ),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\+[0-9]+$/,
      "Invalid phone number format (numbers only) (must have a `+` in the front)"
    )
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be at most 15 digits"),

  workplace: yup
    .string()
    .required("Workplace is required")
    .min(2, "Workplace must be at least 2 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Workplace must contain only letters and spaces (no special characters)"
    ),
});
export function SignUpForm({ togglePage, onSignup, error, success }) {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    doctorLicense: '',
    workplace: '',
    password: '',
  }); // Store form data

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

      onSignup(formData); // Call API if validation is successful

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
        <div className="flex flex-col max-w-full w-[393px]">
          <h3 className="font-semibold text-center text-black">
            Create your account
          </h3>
          <p className="mt-2 text-lg text-zinc-500">
            Welcome! Please fill in the details to get started
          </p>
        </div>
        <form className="flex flex-col mt-12 w-full text-base font-semibold text-black max-w-[490px] max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-row gap-4">
            <TextField
              label={"First Name"}
              id={"firstName"}
              type={"text"}
              formDataChanged={handleFormDataChange}
              value={formData.firstName}
              error={formErrors.firstName}
            />
            <TextField
              label={"Last Name"}
              id={"lastName"}
              type={"text"}
              formDataChanged={handleFormDataChange}
              value={formData.lastName}
              error={formErrors.lastName}
            />
          </div>
          <TextField
            label={"Email Address"}
            id={"emailAddress"}
            type={"email"}
            formDataChanged={handleFormDataChange}
            value={formData.emailAddress}
            error={formErrors.emailAddress}
          />
          <TextField
            label={"Phone Number"}
            id={"phoneNumber"}
            type={"tel"}
            formDataChanged={handleFormDataChange}
            value={formData.phoneNumber}
            error={formErrors.phoneNumber}
          />
          <TextField
            label={"Doctor License"}
            id={"doctorLicense"}
            type={"text"}
            formDataChanged={handleFormDataChange}
            value={formData.doctorLicense}
            error={formErrors.doctorLicense}
          />
          <TextField
            label={"Workplace"}
            id={"workplace"}
            type={"text"}
            formDataChanged={handleFormDataChange}
            value={formData.workplace}
            error={formErrors.workplace}
          />
          <TextField
            label={"Password"}
            id={"password"}
            type={"password"}
            formDataChanged={handleFormDataChange}
            value={formData.password}
            error={formErrors.password}
          />
          <SecondaryButton type="submit"> Continue </SecondaryButton>
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error from parent */}
          {success && <p className="text-green-500 mt-2">{success}</p>} {/* Display success from parent */}
        </form>
      </div>
      <div className="flex justify-center gap-2.5 px-24 pt-20 pb-6 -mt-14 text-lg bg-white rounded-3xl min-h-[132px] text-sky-950 max-md:px-5 max-md:mt-10">
        Already have an account?
        <span
          className="font-bold text-primary hover:cursor-pointer text-nowrap"
          onClick={togglePage}
        >
          Sign in
        </span>
      </div>
    </div>
  );
}