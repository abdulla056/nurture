import {options} from "./add-prediction-options"

export const addPredictionFields = [
  {
    title: "Demographic Factors",
    fields: [
      { id: "deliveryYear", label: "Delivery Year" },
      { id: "deliveryMonth", label: "Delivery Month" },
      { id: "deliveryWeekday", label: "Delivery Weekday" },
      { id: "mothersAge", label: "Mother's Age" },
      {
        id: "mothersRace",
        label: "Mother's Race",
        options: options.race,
      },
      { id: "mothersEducation", label: "Mother's Education" },
      { id: "mothersHeight", label: "Mother's Height (inches)" },
      { id: "prepregnancyWeight", label: "Prepregnancy Weight" },
      { id: "fathersAge", label: "Father's Combined Age" },
    ],
  },
  {
    title: "Lifestyle Factors",
    fields: [
      { id: "wicStatus", label: "WIC Status" },
      {
        id: "cigarettesBeforePregnancy",
        label: "Cigarettes Before Pregnancy (per day)",
      },
      {
        id: "cigarettesFirstTrimester",
        label: "Cigarettes First Trimester (per day)",
      },
      {
        id: "cigarettesSecondTrimester",
        label: "Cigarettes Second Trimester (per day)",
      },
      {
        id: "cigarettesThirdTrimester",
        label: "Cigarettes Third Trimester (per day)",
      },
      { id: "tobaccoUse", label: "Tobacco Use" },
      { id: "monthPrenatalCareBegan", label: "Month Prenatal Care Began" },
    ],
  },
  {
    title: "Risk Data",
    fields: [
      { id: "prePregnancyDiabetes", label: "Pre Pregnancy Diabetes", options: options.prePregnancyDiabetes},
      { id: "gestationalDiabetes", label: "Gestational Diabetes" },
      { id: "prePregnancyHypertension", label: "Pre Pregnancy Hypertension" },
      { id: "gestationalHypertension", label: "Gestational Hypertension" },
      { id: "hypertensionEclampsia", label: "Hypertension Eclampsia" },
      { id: "infertilityTreatment", label: "Infertility Treatment" },
      { id: "fertilityEnhancingDrugs", label: "Fertility Enhancing Drugs" },
      {
        id: "assistedReproductiveTechnology",
        label: "Asst Reproductive Technology",
      },
      { id: "previousCesareans", label: "Previous Cesareans" },
      { id: "rupturedUterus", label: "Ruptured Uterus" },
      { id: "admitToIntensiveCare", label: "Admit to Intensive Care" },
      { id: "wasAutopsyPerformed", label: "Was Autopsy Performed" },
      {
        id: "histologicalPlacentalExam",
        label: "Was Histological Placental Exam Performed",
      },
    ],
  },
  {
    title: "Flags Factors",
    fields: [
      { id: "sexImputed", label: "Sex Imputed" },
      { id: "pluralityImputed", label: "Plurality Imputed" },
      { id: "gestationImputed", label: "Gestation Imputed" },
    ],
  },
];

export const steps = [
  {
    title: "Sending the data to the server",
    description:
      "Please wait while we send the data to the server for processing.",
  },
  {
    title: "Processing the data",
    description: "Please wait while we process the data.",
  },
  {
    title: "Making the prediction",
    description: "Please wait while we make the prediction.",
  },
  {
    title: "Prediction complete",
    description:
      "The prediction is complete. Please click on the button below to view the prediction.",
  },
];

