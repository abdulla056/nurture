export const addPredictionFields = [
    {
        title: "Lifestyle Factors",
        fields: [
            { id: "wicStatus", label: "WIC Status" },
            { id: "cigarettesSecondTrimester", label: "Cigarettes Second Trimester" },
            { id: "tobaccoUse", label: "Tobacco Use" },
            { id: "cigarettesBeforePregnancy", label: "Cigarettes Before Pregnancy" },
            { id: "cigarettesFirstTrimester", label: "Cigarettes First Trimester" },
            { id: "cigarettesThirdTrimester", label: "Cigarettes Third Trimester" },
            { id: "monthPrenatalCareBegan", label: "Month Prenatal Care Began" }
        ]
    },
    {
        title: "Risk Data",
        fields: [
            { id: "prePregnancyDiabetes", label: "Pre Pregnancy Diabetes" },
            { id: "gestationalHypertension", label: "Gestational Hypertension" },
            { id: "infertilityTreatment", label: "Infertility Treatment" },
            { id: "assistedReproductiveTechnology", label: "Asst Reproductive Technology" },
            { id: "rupturedUterus", label: "Ruptured Uterus" },
            { id: "wasAutopsyPerformed", label: "Was Autopsy Performed" },
            { id: "gestationalDiabetes", label: "Gestational Diabetes" },
            { id: "prePregnancyHypertension", label: "Pre Pregnancy Hypertension" },
            { id: "hypertensionEclampsia", label: "Hypertension Eclampsia" },
            { id: "fertilityEnhancingDrugs", label: "Fertility Enhancing Drugs" },
            { id: "previousCesareans", label: "Previous Cesareans" },
            { id: "admitToIntensiveCare", label: "Admit to Intensive Care" },
            { id: "histologicalPlacentalExam", label: "Was Histological Placental Exam Performed" }
        ]
    },
    {
        title: "Demographic Factors",
        fields: [
            { id: "deliveryYear", label: "Delivery Year" },
            { id: "deliveryMonth", label: "Delivery Month" },
            { id: "deliveryWeekday", label: "Delivery Weekday" },
            { id: "mothersAge", label: "Mother's Single Year of Age" },
            { id: "mothersAgeRecode", label: "Mother's Age Recode 14" },
            { id: "mothersRace", label: "Mother's Race Recode 31" },
            { id: "mothersEducation", label: "Mother's Education Revised" },
            { id: "mothersHeight", label: "Mother's Height (inches)" },
            { id: "prepregnancyWeight", label: "Prepregnancy Weight Recode" },
            { id: "birthWeight", label: "Birth Weight Details (g)" },
            { id: "fathersAge", label: "Father's Combined Age" }
        ]
    },
    {
        title: "Flags Factors",
        fields: [
            { id: "sexImputed", label: "Sex Imputed" },
            { id: "pluralityImputed", label: "Plurality Imputed" },
            { id: "gestationImputed", label: "Gestation Imputed" }
        ]
    }
];


export const patientDataVariations = [
  {
      "patientId": "RSW21212",
      "riskLevel": "Low",
      "riskScore": 25,
      "date": "Oct 01, 2022",
      "time": "23:45:21",
      "keyFactors": [
          "Maternal Age",
          "Blood Pressure"
      ]
  },
  {
      "patientId": "ABC12345",
      "riskLevel": "Medium",
      "riskScore": 60,
      "date": "Nov 15, 2022",
      "time": "10:30:00",
      "keyFactors": [
          "Maternal Age",
          "Blood Pressure"
      ]
  },
  {
      "patientId": "XYZ78901",
      "riskLevel": "High",
      "riskScore": 85,
      "date": "Dec 20, 2022",
      "time": "16:15:00",
      "keyFactors": [
          "Maternal Age",
          "Blood Pressure"
      ]
  },
  {
      "patientId": "PQR56789",
      "riskLevel": "Very Low",
      "riskScore": 10,
      "date": "Jan 05, 2023",
      "time": "08:45:00",
      "keyFactors": [
          "Maternal Age",
          "Blood Pressure"
      ]
  }
]