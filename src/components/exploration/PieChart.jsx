import React, { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PrimaryContainer from "../layout/PrimaryContainer";
import { PredictionDetailsContext } from "../../store/prediction-details-context";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const { contributingFactors } = useContext(PredictionDetailsContext);
  const contributingFactorsArray = Object.entries(contributingFactors).map(
    ([key, value]) => ({ key, value })
  );
  contributingFactorsArray.sort((a, b) => b.value - a.value);
  const labels = contributingFactorsArray.map((factor) => factor.key);
  const dataValues = contributingFactorsArray.map((factor) => factor.value);
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

  return (
    <PrimaryContainer className="pt-12 w-3/5">
      <h2 className="font-medium text-center mb-4">Pie Chart</h2>
      <div className="border rounded-lg border-[#C5C5C5] w-full">
        <Pie data={data} className="p-6" />
      </div>
    </PrimaryContainer>
  );
}
