import LoginForm from "../components/auth/LoginForm.jsx";
import { useNavigate } from "react-router-dom";
import { SignUpFeatures } from "../components/auth/SignUpFeatures.jsx";
import { SignUpForm } from "../components/auth/SignUpForm.jsx";
import { Footer } from "../components/common/Footer.jsx";
import { useState } from "react";
import api from "../services/api";

export default function SignUpPage() {
  const [signUpPage, setPage] = useState(true);
  const [signupError, setSignupError] = useState(null); // Lifted state
  const [signupSuccess, setSignupSuccess] = useState(null);
  const navigate = useNavigate();

  function togglePage() {
    setPage((prevValue) => !prevValue);
  }
  
  const handleSignup = async (data) => { // Callback from SignUpForm
    setSignupError(null); // Clear previous errors
    try {
        console.log(data);  
        const res = await api.post("/auth/register", data);
        localStorage.setItem('token', token);
        setSignupSuccess("Signup successful!"); // Set success message
        navigate("/dashboard");
    } catch (error) {
        // ... (error handling as before, but now setSignupError)
        if (error.response && error.response.data && error.response.data.message) {
          setSignupError(error.response.data.message);
        } else if (error.response && error.response.data && error.response.data.error) {
           setSignupError(error.response.data.error);
        }
        else {
          setSignupError("An error occurred during signup.");
        }
    }
  };

  return (
    <div className="py-16 px-16 bg-custom-gradient flex flex-col items-center">
      {signUpPage ? (
        <div className="flex flex-col gap-16 max-md:max-w-full justify-center md:flex-row">
          <SignUpFeatures />
          <SignUpForm togglePage={togglePage} onSignup={handleSignup} error={signupError} success={signupSuccess} /> {/* Pass the callback and error state */}
        </div>
      ) : (
        <LoginForm togglePage = {togglePage}/> 
      )}
      <Footer />
    </div>
  );
}
