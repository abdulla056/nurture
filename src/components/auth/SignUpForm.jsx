import * as React from "react";
import TextField from "../common/TextField";
import SecondaryButton from "./SecondaryButton";
import axios from "axios"; // Import axios
import { useForm } from 'react-hook-form'; // Import react-hook-form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validates the inputs
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  emailAddress: yup.string().required("Email is required").email("Invalid email format"),
  doctorLicense: yup.string().required("Doctor license is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

export function SignUpForm({ togglePage, onSignup, error, success }) {
  async function authenticate(data) {
    // ... (no need to manage error state here anymore)
    onSignup(data); // Call the callback in the parent
  }
  return (
    <div className="flex flex-col rounded-none min-w-[240px] w-[561px] max-md:max-w-full">
      <div className="flex z-10 flex-col items-center px-9 py-8 w-full bg-white rounded-3xl border border-solid border-neutral-300 shadow-[0px_0px_40px_rgba(0,0,0,0.12)] max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col max-w-full w-[393px]">
          <h3 className="font-semibold text-center text-black">
            Create your account
          </h3>
          <p className="mt-2 text-lg text-zinc-500">
            Welcome! Please fill in the details to get started
          </p>
        </div>
        <form className="flex flex-col mt-12 w-full text-base font-semibold text-black max-w-[490px] max-md:mt-10 max-md:max-w-full" >
          <div className="flex flex-row gap-4">
            <TextField
              label={"First Name"}
              id={"firstName"}
              type={"text"}
            />
            <TextField
              label={"Last Name"}
              id={"lastName"}
              type={"text"}
            />
          </div>
          <TextField
            label={"Email Address"}
            id={"emailAddress"}
            type={"email"}
          />
          <TextField
            label={"Doctor License"}
            id={"doctorLicense"}
            type={"text"}
          />
          <TextField
            label={"Password"}
            id={"password"}
            type={"password"}
          />
          <SecondaryButton type="submit"> Continue </SecondaryButton>
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error from parent */}
          {success && <p className="text-green-500 mt-2">{success}</p>} {/* Display success from parent */}
        </form>
      </div>
      <div className="gap-2.5 px-36 pt-20 pb-6 -mt-14 text-lg bg-white rounded-3xl min-h-[132px] text-sky-950 max-md:px-5 max-md:mt-10">
        Already have an account?{" "}
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
