import TextField from "../common/TextField";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import Logo from "../common/Logo";

export default function LoginForm({ togglePage }) {
  return (
    <div className="flex flex-col rounded-none min-w-[240px] w-[561px] max-md:max-w-full">
      <div className="flex z-10 flex-col items-center px-9 py-8 w-full bg-white rounded-3xl border border-solid border-neutral-300 shadow-[0px_0px_40px_rgba(0,0,0,0.12)] max-md:px-5 max-md:max-w-full">
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
          ></TextField>
          <TextField
            label={"Password"}
            id={"password"}
            type={"password"}
          ></TextField>
          <SecondaryButton type="submit"> Continue </SecondaryButton>
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
