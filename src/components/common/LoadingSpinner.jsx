import React from "react";

const LoadingSpinner = ({ size = "12", color = "border-blue-500" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${size} h-${size} border-4 border-t-transparent ${color} rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
