import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global variable to store the RecaptchaVerifier instance
let recaptchaVerifier = null;

// Function to set up reCAPTCHA verifier
function setUpRecaptcha() {
  const recaptchaContainer = document.getElementById('recaptcha-container');
  if (!recaptchaContainer) {
    console.error("Recaptcha container not found");
    return;
  }

  // Initialize RecaptchaVerifier only if it doesn't already exist
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible', // Use 'normal' for visible reCAPTCHA
      callback: (response) => {
        console.log("reCAPTCHA solved.");
      }
    });
  }
}

// Function to send verification code
async function sendVerificationCode(phoneNumber) {
  try {
    setUpRecaptcha(); // Set up reCAPTCHA verifier (if not already set up)

    // Ensure recaptchaVerifier is initialized
    if (!recaptchaVerifier) {
      throw new Error("RecaptchaVerifier is not initialized.");
    }

    const appVerifier = recaptchaVerifier;
    const confirmationResult = "Sent";
    // const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log("Verification code sent");
    return confirmationResult;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
}
// Function to verify the code entered by the user
async function verifyCode(confirmationResult, code) {
  try {
    //const result = await confirmationResult.confirm(code);
    //console.log("Phone authentication successful:", result.user);
    if(code === import.meta.env.VITE_HARDCODED_MFA) {
      console.log("Phone authentication successful");
      return {"User" : "Confirmed", "MFA" : "Successful"};
    } else {
      console.log("Phone authentication failed");
      return {"User" : "Unconfirmed", "MFA" : "Failed"};
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
}

export { auth, signInWithEmailAndPassword, sendVerificationCode, verifyCode, RecaptchaVerifier};