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
    <PrimaryContainer className="w-1/2 !p-7">
      <h2>PCA Clustering of Maternal Health Patients</h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {scatterData && (
            <AnimatePresence>
              <motion.div className="bg-background" {...fadeInUp}>
                <Plot
                  data={scatterData}
                  layout={scatterLayout}
                  style={{ width: "100%", height: "500px" }}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {barData && (
            <AnimatePresence>
              <motion.div className="bg-background mt-4" {...fadeInUp}>
                <Plot
                  data={barData}
                  layout={barLayout}
                  style={{ width: "100%", height: "400px" }}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </PrimaryContainer>
  );
}