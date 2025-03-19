import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import api from "../../services/api";
import PrimaryContainer from "../layout/PrimaryContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInUp } from "../../animations/variations";

export default function PCACluster() {
  const [scatterData, setScatterData] = useState(null); // State to hold 3D scatter plot data
  const [scatterLayout, setScatterLayout] = useState(null); // State to hold 3D scatter plot layout
  const [barData, setBarData] = useState(null); // State to hold bar chart data
  const [barLayout, setBarLayout] = useState(null); // State to hold bar chart layout

  // Fetch PCA clustered data when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch the initial visualization data
        const response = await api.get("/unsupervised/get_initial_data", {withCredentials: true});
        if (response.data.scatter_data) {
          setScatterData(response.data.scatter_data); // Set 3D scatter plot data
          setScatterLayout(response.data.scatter_layout); // Set 3D scatter plot layout
          setBarData(response.data.bar_data); // Set bar chart data
          setBarLayout(response.data.bar_layout); // Set bar chart layout
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
      {scatterData ? (
        <AnimatePresence>
          <motion.div
            className="bg-background"
            {...fadeInUp}
          >
            <Plot
              data={scatterData}
              layout={scatterLayout}
              style={{ width: "100%", height: "500px" }} // Ensure responsiveness
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <LoadingSpinner />
      )}

      {/* Display the bar chart for cluster distribution */}
      {barData && (
        <AnimatePresence>
          <motion.div
            className="bg-background mt-4"
            {...fadeInUp}
          >
            <Plot
              data={barData}
              layout={barLayout}
              style={{ width: "100%", height: "400px" }} // Ensure responsiveness
            />
          </motion.div>
        </AnimatePresence>
      )}
    </PrimaryContainer>
  );
}