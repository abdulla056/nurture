import { featureList } from "../../assets/data/data";
import FeaturesContent from "./FeaturesContent";
import { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState("prediction");

  function handleFeatureClick(featureKey) {
    setActiveFeature(featureKey);
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-3 w-full">
        {Object.keys(featureList).map((featureKey) => (
          <FeaturesContent
            key={featureKey}
            feature={featureList[featureKey]}
            isActive={activeFeature === featureKey}
            onClick={() => handleFeatureClick(featureKey)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {featureList[activeFeature] && ( 
          <motion.img
            key={activeFeature} 
            src={featureList[activeFeature].image}
            alt="Image of the feature"
            className="w-5/12 h-auto rounded-xl opacity-90"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
