import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PrimaryContainer from "../layout/PrimaryContainer";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  // Data for the chart
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2, 3], // Data for the chart
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
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

  return (
    <PrimaryContainer className="pt-12 w-3/5">
      <h2 className="font-medium text-center mb-4">Pie Chart</h2>
      <div className="border rounded-lg border-[#C5C5C5] w-full">
        <Pie data={data} className="p-6" />
      </div>
    </PrimaryContainer>
  );
}
