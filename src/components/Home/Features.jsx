import { featureList } from "../../assets/data/data";
import FeaturesContent from "./FeaturesContent";
import { useState, useEffect } from "react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState("prediction");
  const [imageLoaded, setImageLoaded] = useState(true);

  function handleFeatureClick(featureKey) {
    // Update the active state of all features to false
    const updatedFeatures = { ...featureList };
    for (const key in updatedFeatures) {
      updatedFeatures[key].isActive = false;
    }

    // Set the active state of the clicked feature to true
    updatedFeatures[featureKey].isActive = true;
    setImageLoaded(false);

    // Update the state with the modified features
    setActiveFeature(featureKey);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setImageLoaded(true), 100); // Delay fade-in
    return () => clearTimeout(timeout);
  }, [activeFeature]);
  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col gap-3 w-full">
        {Object.keys(featureList).map((featureKey) => (
          <FeaturesContent
            key={featureKey}
            feature={featureList[featureKey]}
            isActive={featureList[featureKey].isActive}
            onClick={() => handleFeatureClick(featureKey)}
          />
        ))}
      </div>
      <img
        src={featureList[activeFeature].image}
        alt="Image of the feature"
        className={`w-2/6 mr-12 rounded-xl opacity-90 transition-opacity duration-500 ${
          imageLoaded ? "opacity-90" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)} // Ensure smooth fade-in when image is loaded
      />
    </div>
  );
}
