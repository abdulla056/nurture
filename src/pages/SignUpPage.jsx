import LoginForm from "../components/auth/LoginForm.jsx";
import { SignUpFeatures } from "../components/auth/SignUpFeatures.jsx";
import { SignUpForm } from "../components/auth/SignUpForm.jsx";
import { Footer } from "../components/common/Footer.jsx";
import { useState } from "react";

export default function SignUpPage() {
  const [signUpPage, setPage] = useState(true);

  function togglePage() {
    setPage((prevValue) => !prevValue);
  }
  return (
    <div className="py-16 px-16 bg-custom-gradient flex flex-col items-center">
      {signUpPage ? (
        <div className="flex flex-col gap-16 max-md:max-w-full justify-center md:flex-row">
          <SignUpFeatures />
          <SignUpForm togglePage={togglePage} />
        </div>
      ) : (
        <LoginForm togglePage = {togglePage}/> 
      )}
      <Footer />
    </div>
  );
}
