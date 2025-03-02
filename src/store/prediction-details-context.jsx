import { createContext } from "react";

export const PredictionDetailsContext = createContext({
    riskScore: null,
    predictionId: null,
    timeStamp: null,
    confidenceScore: null,
    contributingFactors: [],
    detailId: null,
    doctorId: null,
    expectedOutcome: null,
    patientId: null,
    predictionResult: null,
    riskLevel: null,
})