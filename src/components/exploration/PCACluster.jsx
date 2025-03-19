import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import api from "../../services/api";
import PrimaryContainer from "../layout/PrimaryContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInUp } from "../../animations/variations";

export default function PCACluster() {
  const [scatterData, setScatterData] = useState(null);
  const [scatterLayout, setScatterLayout] = useState(null);
  const [barData, setBarData] = useState(null);
  const [barLayout, setBarLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch updated data when the component mounts
  useEffect(() => {
    const fetchUpdatedData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/unsupervised/update_and_visualize");
        if (response.data.scatter_data) {
          setScatterData(response.data.scatter_data);
          setScatterLayout(response.data.scatter_layout);
          setBarData(response.data.bar_data);
          setBarLayout(response.data.bar_layout);
        }
      } catch (error) {
        console.error("Error fetching updated data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedData();
  }, []);

  return (
    <PrimaryContainer className=" !p-7 !mb-16 w-full">
      <h2>PCA Clustering of Maternal Health Data</h2>

      <div className="flex flex-row w-full justify-between px-6">
        {/* Display the PCA clustered visualization */}
        {scatterData ? (
          <AnimatePresence>
            <motion.div {...fadeInUp}>
              <Plot
                data={scatterData}
                layout={scatterLayout}
                className="w-1/2"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <LoadingSpinner />
        )}

        {/* Display the bar chart for cluster distribution */}
        {barData && (
          <AnimatePresence>
            <motion.div className="mt-4" {...fadeInUp}>
              <Plot
                data={barData}
                layout={barLayout}
                className="w-96"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PrimaryContainer>
  );
}
