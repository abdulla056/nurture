import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({percentage, index, metric}) => {
  // Data for the donut chart
  const data = {
    datasets: [
      {
        data: percentage,
        backgroundColor: ["rgba(0, 44, 101, 1)", "rgba(197, 197, 197, 1)"],
        borderColor: ["rgba(0, 44, 101, 0.8)", "rgba(197, 197, 197, 1)"],
      },
    ],
  };
  const options = {
    cutout: "85%",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  return (
    <div key={index} className="flex flex-col items-center gap-2 w-24">
      <Doughnut data={data} options={options}/>
      <span className="text-xs text-font-tertiary">{metric}</span>
    </div>
  );
};

export default DonutChart;
