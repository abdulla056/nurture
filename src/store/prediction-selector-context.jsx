import { createContext } from "react";

export const PredictionSelectorContext = createContext({
    predictionId: "",
    setPrediction: () => {},
    getPrediction: () => {},
    resetPrediction: () => {},
})