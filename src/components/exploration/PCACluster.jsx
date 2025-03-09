import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import api from "../../services/api";
import PrimaryContainer from "../layout/PrimaryContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInUp } from "../../animations/variations";

export default function PCACluster() {
  const [plotData, setPlotData] = useState(null); // State to hold Plotly data

  // Fetch PCA clustered data when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch the initial visualization data
        const response = await api.get("/unsupervised/get_initial_data");
        if (response.data.plot_data) {
          setPlotData(response.data.plot_data); // Set initial plot data
        }
      } catch (error) {
        console.error("Error fetching PCA clustered data:", error);
        console.error("Error details:", error.response); // Log the full error response
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <PrimaryContainer className="w-1/2 !p-7">
      <h2>PCA Clustering of Maternal Health Data</h2>

      {/* Display the PCA clustered visualization */}
      {plotData ? (
        <AnimatePresence>
          <motion.div
            className="bg-background"
            {...fadeInUp}
          >
            <Plot
              data={plotData.data}
              layout={plotData.layout}
              style={{ width: "100%", height: "500px" }} // Ensure responsiveness
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <LoadingSpinner />
      )}
    </PrimaryContainer>
  );
}
