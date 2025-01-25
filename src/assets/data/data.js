import predictionImage from "../../assets/images/overview-screen.png";
import alertsImage from "../../assets/images/notifications-screen.png";
import visualizeImage from "../../assets/images/visualize-screen.png";
import xaiImage from "../../assets/images/XAI-screen.png";

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