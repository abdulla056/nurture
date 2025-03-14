import React, { useState } from "react";
import axios from "axios";

const App = () => {
  // Field names for each category
  const demographics = [
    "Delivery_Year",
    "Delivery_Month",
    "Weekday",
    "Mothers_Age_1",
    "Mothers_Race_Recode6",
    "Mothers_Education_Revised",
    "Mothers_Height_in_Inches",
    "Prepregnancy_Weight_Recode",
    "Fathers_Combined_Age",
    "Sex_of_Infant",
    "Birth_Weight_Detail_in_Grams",
  ];

  const lifestyle_factors = [
    "WIC_Status",
    "Cigarettes_Before_Pregnancy",
    "Cigarettes_First_Trimester",
    "Cigarettes_Second_Trimester",
    "Cigarettes_Third_Trimester",
    "Tobacco_Use",
    "Month_Prenatal_Care_Began",
    "BMI_prepregnancy",
  ];

  const risk_factors = [
    "Prepregnancy_Diabetes",
    "Gestational_Diabetes",
    "Prepregnancy_Hypertension",
    "Gestational_Hypertension",
    "Hypertension_Eclampsia",
    "Infertility_Treatment",
    "Fertility_Enhancing_Drugs",
    "Asst_Reproductive_Technology",
    "Previous_Cesareans",
    "Ruptured_Uterus",
    "Admit_to_Intensive_Care",
    "Was_Autopsy_Performed",
    "Was_Histological_Placental_Exam_Performed",
  ];

  // State for form data
  const [formData, setFormData] = useState({
    ...demographics.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    ...lifestyle_factors.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    ...risk_factors.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
  });

  const [pageNumber, setPageNumber] = useState(0); // Tracks the current form page
  const [selectedGroup, setSelectedGroup] = useState(null); // Selected prediction group
  const [predictionResult, setPredictionResult] = useState(null); // Stores prediction result
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call

  // Form field categories
  const categories = [
    { key: "demographic", label: "Demographic Factors", fields: demographics },
    { key: "lifestyle", label: "Lifestyle Factors", fields: lifestyle_factors },
    { key: "risk_factors", label: "Risk Factors", fields: risk_factors },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const category = selectedGroup; // Current category (demographic, lifestyle, risk_factors)
      const fields = categories.find((cat) => cat.key === category).fields; // Get fields for the selected category
      const features = fields.map((field) => formData[field]); // Extract only the relevant features

      // Log the user input to the console
      console.log("User Input for Category:", category);
      console.log("Form Data:", formData);
      console.log("Features Being Sent:", features);

      // Send request to Flask backend
      const response = await axios.post("https://127.0.0.1:5001/supervised/predict_and_explain", {
        category: categories.findIndex((cat) => cat.key === category).toString(), // "0", "1", or "2"
        features: features,
      });

      // Log the response for debugging
      console.log("Flask Response:", response.data);

      // Set prediction result
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render form fields
  const renderFormFields = () => {
    const allFields = [...demographics, ...lifestyle_factors, ...risk_factors];

    return (
      <div className="grid grid-cols-2 gap-4">
        {allFields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field
                .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
                .replace(/^./, (str) => str.toUpperCase())} {/* Capitalize first letter */}
            </label>
            <input
              type="text"
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}
      </div>
    );
  };

  // Render prediction group selection
  const renderGroupSelection = () => {
    return (
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-2xl font-bold">Select Prediction Group</h3>
        <div className="flex gap-4">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => {
                setSelectedGroup(category.key);
                handleSubmit();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render prediction result
  const renderPredictionResult = () => {
    if (!predictionResult) return null;

    return (
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-2xl font-bold">Prediction Result</h3>
        <p>
          <strong>Expected Outcome:</strong> {predictionResult["Expected outcome"]}
        </p>
        <p>
          <strong>Confidence:</strong> {(predictionResult.Confidence * 100).toFixed(2)}%
        </p>
        <img
          src={`data:image/png;base64,${predictionResult.explanation_image}`}
          alt="LIME Explanation"
          className="w-full max-w-md"
        />
        <pre className="bg-gray-100 p-4 rounded">
          {predictionResult.contributing_factors}
        </pre>
        <button
          onClick={() => {
            setPredictionResult(null);
            setPageNumber(0);
            setSelectedGroup(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Make Another Prediction
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-12 gap-8">
      {/* Form Input Screen */}
      {pageNumber === 0 && (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold">Enter Data</h3>
          {renderFormFields()}
          <button
            onClick={() => setPageNumber(1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Group Selection Screen */}
      {pageNumber === 1 && renderGroupSelection()}

      {/* Prediction Result */}
      {predictionResult && renderPredictionResult()}
    </div>
  );
};

export default App;