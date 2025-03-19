import React, { useContext, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PrimaryContainer from "../layout/PrimaryContainer";
import { PredictionDetailsContext } from "../../store/prediction-details-context";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../common/LoadingSpinner";
import PrimaryButton from "../common/PrimaryButton";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const { contributingFactors } = useContext(PredictionDetailsContext);
  if (!contributingFactors) {
    return ( 
      <div style={{ paddingTop: '50px' }}> {/* Adjust the value as needed */}
        <LoadingSpinner />
      </div> // Show a loading spinner or message
      )
  }
  const contributingFactorsArray = Object.entries(contributingFactors).map(
    ([key, value]) => ({ key, value })
  );
  contributingFactorsArray.sort((a, b) => b.value - a.value);
  const labels = contributingFactorsArray.map((factor) => factor.key);
  const dataValues = contributingFactorsArray.map((factor) => factor.value);
  const chartRef = useRef();
  // Data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Votes",
        data: dataValues, // Data for the chart
        backgroundColor: [
          "rgba(255, 0, 50, 0.8)", // Intense crimson red
          "rgba(0, 80, 255, 0.8)", // Deep electric blue
          "rgba(255, 170, 0, 0.8)", // Harsh golden yellow
          "rgba(0, 200, 100, 0.8)", // Neon greenish-teal
          "rgba(110, 0, 255, 0.8)", // Pure deep violet
          "rgba(255, 80, 0, 0.8)", // Fiery orange-red
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };


  const downloadChart = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const chartCanvas = chartInstance.canvas;
      const image = chartCanvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.href = image;
      link.download = "pie_chart.png";
      link.click();
    }
  };

  return (
    <PrimaryContainer className="pt-12 w-3/5">
      <h2 className="font-medium text-center mb-4">Pie Chart</h2>
      <div className="border rounded-lg border-[#C5C5C5] w-full">
        <Pie data={data} className="p-6" ref={chartRef} />
      </div>
      <div
          className="gap-4 flex flex-row fixed left-1/2  transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: "87%" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <PrimaryButton
              className={
                "opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"
              }
            >
              Export to CSV
            </PrimaryButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <PrimaryButton
              className={
                "opacity-75 hover:opacity-100 bg-primary text-white py-6 px-10 rounded-2xl text-xl hover:scale-105"
              }
              onClick={downloadChart}
            >
              Download PDF
            </PrimaryButton>
          </motion.div>
        </div>
    </PrimaryContainer>
  );
}
