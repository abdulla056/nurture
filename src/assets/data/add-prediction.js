export const addPredictionFields = [
    {
        title: "Lifestyle factors",
        fields: [
            "WIC Status",
            "Cigarettes Second Trimester",
            "Tobacco Use",
            "Cigarettes Before Pregnancy",
            "Cigarettes First Trimester",
            "Cigarettes Third Trimester",
            "Month Prenatal Care Began"
        ]
    },
    {
        title: "Risk Data",
        fields: [
            "Pre Pregnancy Diabetes",
            "Gestational Hypertension",
            "Infertility Treatment",
            "Asst Reproductive Technology",
            "Ruptured Uterus",
            "Was Autopsy Performed",
            "Gestational Diabetes",
            "Pre Pregnancy Hypertension",
            "Hypertension Eclampsia",
            "Fertility Enhancing Drugs",
            "Previous Cesareans",
            "Admit to Intensive Care",
            "Was histological Placental Exam Performed"
        ]
    },
    {
        title: "Demographic Factors",
        fields: [
            "Delivery Year",
            "Delivery Month",
            "Delivery Weekday",
            "Mother's Single Year of Age",
            "Mother's Age Recode 14",
            "Mother's Race Recode 31",
            "Mother's Education Revised",
            "Mother's Height (inches)",
            "Prepregnancy Weight Recode",
            "Birth Weight Details (g)",
            "Father's Combined Age"
        ]
    },
    {
        title: "Flags Factors",
        fields: [
            "Sex imputed",
            "Plurality imputed",
            "Gestation imputed"
        ]
    }
]

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