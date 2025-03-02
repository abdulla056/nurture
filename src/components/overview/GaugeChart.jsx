import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value, isConfidence}) => { 
  const getColor = (value, isConfidence) => {
    if (value <= 30) return isConfidence ? "#f44336" : "#4caf50" ; // Green for low values
    if (value <= 70) return "#ffeb3b"; // Yellow for medium values
    return isConfidence ?  "#4caf50" : "#f44336"; // Red for high values
  };

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [getColor(value, isConfidence), "#e0e0e0"],
        borderWidth: 0,
        circumference: 180, // Half-circle
        rotation: 270, // Start from top
        cutout: "60%", // Thickness of the gauge
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "230px", height: "130px" }}>
      <Doughnut data={data} options={options} />
      <div
        style={{ textAlign: "center", marginTop: "-50px", fontSize: "24px" }}
        className="text-font"
      >
        {value}%
      </div>
    </div>
  );
};

export default GaugeChart;
