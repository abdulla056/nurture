import { options } from "./add-prediction-options";

export const addPredictionFields = [
  {
    title: "Demographic Factors",
    fields: [
      { id: "deliveryYear", label: "Delivery Year" },
      {
        id: "deliveryMonth",
        label: "Delivery Month",
        options: options.deliveryMonth,
      },
      {
        id: "deliveryWeekday",
        label: "Delivery Weekday",
        options: options.deliveryWeekday,
      },
      { id: "mothersAge", label: "Mother's Age" },
      {
        id: "mothersRace",
        label: "Mother's Race",
        options: options.race,
      },
      {
        id: "mothersEducation",
        label: "Mother's Education",
        options: options.mothersEducation,
      },
      { id: "mothersHeight", label: "Mother's Height (inches)" },
      { id: "prepregnancyWeight", label: "Prepregnancy Weight" },
      { id: "fathersAge", label: "Father's Combined Age" },
      { id: "sexOfInfant", label: "Sex of Infant", options: options.sexOfInfant },
      { id: "birthWeight", label: "Birth Weight in Grams" },
    ],
  },
  {
    title: "Lifestyle Factors",
    fields: [
      { id: "wicStatus", label: "WIC Status", options: options.wicStatus },
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
      { id: "tobaccoUse", label: "Tobacco Use", options: options.tobaccoUse },
      {
        id: "monthPrenatalCareBegan",
        label: "Month Prenatal Care Began",
        options: options.prenatalCare,
      },
      { id: "bmiPrePregnancy", label: "BMI Pre Pregnancy" },
    ],
  },
  {
    title: "Risk Data",
    fields: [
      {
        id: "prePregnancyDiabetes",
        label: "Pre Pregnancy Diabetes",
        options: options.prePregnancyDiabetes,
      },
      {
        id: "gestationalDiabetes",
        label: "Gestational Diabetes",
        options: options.gestationalDiabetes,
      },
      {
        id: "prePregnancyHypertension",
        label: "Pre Pregnancy Hypertension",
        options: options.prePregnancyHypertension,
      },
      {
        id: "gestationalHypertension",
        label: "Gestational Hypertension",
        options: options.gestationalHypertension,
      },
      {
        id: "hypertensionEclampsia",
        label: "Hypertension Eclampsia",
        options: options.hypertensionEclampsia,
      },
      {
        id: "infertilityTreatment",
        label: "Infertility Treatment",
        options: options.infertilityTreatment,
      },
      {
        id: "fertilityEnhancingDrugs",
        label: "Fertility Enhancing Drugs",
        options: options.fertilityEnhancingDrugs,
      },
      {
        id: "assistedReproductiveTechnology",
        label: "Asst Reproductive Technology",
        options: options.assistedReproductiveTechnology,
      },
      {
        id: "previousCesareans",
        label: "Previous Cesareans",
        options: options.previousCesareans,
      },
      {
        id: "rupturedUterus",
        label: "Ruptured Uterus",
        options: options.rupturedUterus,
      },
      {
        id: "admitToIntensiveCare",
        label: "Admit to Intensive Care",
        options: options.admitToIntensiveCare,
      },
      {
        id: "wasAutopsyPerformed",
        label: "Was Autopsy Performed",
        options: options.wasAutopsyPerformed,
      },
      {
        id: "histologicalPlacentalExam",
        label: "Was Histological Placental Exam Performed",
        options: options.wasHistologicalPlacentalExamPerformed,
      },
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
