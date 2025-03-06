import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

export default function PCAClusterScreen() {
  const [plotData, setPlotData] = useState(null); // State to hold Plotly data

  // Fetch PCA clustered data when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch the initial visualization data
        const response = await axios.get("http://127.0.0.1:5000/get_initial_data");
        if (response.data.plot_data) {
          setPlotData(response.data.plot_data); // Set initial plot data
        }
      } catch (error) {
        console.error("Error fetching PCA clustered data:", error);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h2>PCA Clustering of Maternal Health Data</h2>

      {/* Display the PCA clustered visualization */}
      {plotData && (
        <div>
          <Plot
            data={plotData.data}
            layout={plotData.layout}
            style={{ width: "100%", height: "500px" }} // Ensure responsiveness
          />
        </div>
      )}
    </div>
  );
}