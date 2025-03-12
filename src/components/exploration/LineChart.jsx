import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const chartRef = useRef(null); // Reference for the chart container

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // X-axis labels
    datasets: [
      {
        label: "Risk Score Over Time",
        data: [30, 45, 28, 50, 75, 60], // Data points
        borderColor: "rgba(75,192,192,1)", // Line color
        backgroundColor: "rgba(75,192,192,0.2)", // Fill color
        pointBackgroundColor: "rgba(75,192,192,1)", // Point color
        borderWidth: 2,
        tension: 0.4, // Curve effect
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const exportToPDF = () => {
    const chartElement = chartRef.current; // Get the chart container

    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 150); // Adjust size & position
      pdf.save("line_chart.pdf"); // Download the PDF
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Risk Score Over Time</h2>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} className="graph-border bg-white p-4 shadow-lg rounded-lg">
        <Line data={data} options={options} />
      </div>
      <button
        onClick={exportToPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
};

export default LineChart;
