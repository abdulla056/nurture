import LoginForm from "../components/auth/LoginForm.jsx";
import { SignUpFeatures } from "../components/auth/SignUpFeatures.jsx";
import { SignUpForm } from "../components/auth/SignUpForm.jsx";
import { Footer } from "../components/common/Footer.jsx";
import { useState } from "react";

export function SignUpPage() {
  const [signUpPage, setPage] = useState(true);

  function togglePage() {
    setPage((prevValue) => !prevValue);
  }
  return (
    <div className="mt-16 mb-16">
      {signUpPage ? (
        <div className="flex flex-row gap-16 max-md:max-w-full justify-center">
          <SignUpFeatures />
          <SignUpForm togglePage={togglePage} />
        </div>
      ) : (
        <LoginForm togglePage = {togglePage}/> 
        // <div>fasijfbaskjbfd</div>
      )}
      <Footer />
    </div>
    //   {/* </div>
    // </div> */}
  );
}
