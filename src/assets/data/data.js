import predictionImage from "../../assets/images/overview-screen.png";
import alertsImage from "../../assets/images/notifications-screen.png";
import visualizeImage from "../../assets/images/visualize-screen.png";
import xaiImage from "../../assets/images/XAI-screen.png";
import calendarIcon from "../images/calendar.png";

export const featureList = {
    prediction: {
      image: predictionImage,
      title: "Predict the causes of mortality",
      description:
        "Discover insights into potential causes of fetal mortality through data-driven analysis and machine learning predictions, helping healthcare providers improve prenatal care outcomes",
      isActive: true,
    },
    alerts: {
      image: alertsImage,
      title: "Alerts",
      description:
        "Receive timely notifications and alerts based on specific criteria or events related to fetal health, allowing for prompt medical intervention and improved patient care.",
      isActive: false,
    },
    visualize: {
      image: visualizeImage,
      title: "Visualize",
      description:
        "Explore and understand fetal health data through interactive visualizations, such as charts, graphs, and maps, to identify trends, patterns, and areas of concern.",
      isActive: false,
    },
    xai: {
      image: xaiImage,
      title: "XAI",
      description:
        "Gain insights into the reasoning behind the machine learning model's predictions, increasing trust and transparency in the decision-making process.",
      isActive: false,
    },
  };

  export const pastPredictions = [
      {
        date: "Jan 12",
        time: "10:12"
      },
      {
        date: "Jan 26",
        time: "14:54"
      },
      {
        date: "Feb 12",
        time: "10:12"
      },
      {
        date: "Mar 30",
        time: "10:12"
      },
      {
        date: "Jun 21",
        time: "10:12"
      }
    ];

    export const healthFactors = {
      biggestFactor: {
        title: "Smoking history",
        description: "How much the patient has been smoking",
        percentage: 54,
      },
      otherFactors: [
        {
          title: "Physical activity",
          description: "How active is the patient daily?",
          percentage: 12,
        },
        {
          title: "Diet quality",
          description: "How balanced is the patient's diet?",
          percentage: 8,
        },
        {
          title: "Stress levels",
          description: "How stressed is the patient generally?",
          percentage: 5,
        },
        {
          title: "Sleep quality",
          description: "How well does the patient sleep?",
          percentage: 4,
        },
        {
          title: "Alcohol consumption",
          description: "How much alcohol does the patient consume?",
          percentage: 4,
        },
        {
          title: "Genetic predisposition",
          description: "Does the patient have any family history of similar issues?",
          percentage: 3,
        },
      ],
    };

    export const performanceData = [
      {
        percentage: [54, 46],
        metric: "Accuracy",
      },
      {
        percentage: [71, 29],
        metric: "Precision",
      },
      {
        percentage: [63, 37],
        metric: "Recall",
      },
      {
        percentage: [21, 79],
        metric: "F-1",
      },
    ];

    export const riskAssessments = [
      {
        date: "30th January 2025",
        time: "10:12:21",
        riskScore: "Medium"
      },
      {
        date: "30th January 2025",
        time: "10:15:45",
        riskScore: "High"
      },
      {
        date: "29th January 2025",
        time: "09:30:10",
        riskScore: "Low"
      },
      {
        date: "28th January 2025",
        time: "14:50:33",
        riskScore: "Medium"
      },
      {
        date: "27th January 2025",
        time: "08:05:17",
        riskScore: "High"
      },
      {
        date: "26th January 2025",
        time: "16:20:55",
        riskScore: "Low"
      }
    ];

    export const predictionDetails = [
      { icon: calendarIcon, title: "Date", data: "26th January 2024" },
      { icon: calendarIcon, title: "Time", data: "17:32:21" },
      { icon: calendarIcon, title: "Expected Delivery", data: "26th January 2024" },
      { icon: calendarIcon, title: "Prediction Model", data: "Resnet" },
    ];
  
    
    