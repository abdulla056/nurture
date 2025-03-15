import pickle
import numpy as np
import pandas as pd
import plotly.graph_objs as go
import os
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import firebase_admin  # type: ignore
from firebase_admin import credentials, firestore  # type: ignore
from config import Config

# Load Firebase credentials from environment variable
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

# Initialize Firebase app if not already initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

unsupervised_bp = Blueprint('unsupervised_bp', __name__)

# ✅ Load trained models and scaler
KMEANS_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "kmeans_model.pkl")
kmeans_model = pickle.load(open(KMEANS_MODEL_PATH, "rb"))

PCA_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "pca.pkl")
pca_model = pickle.load(open(PCA_MODEL_PATH, "rb"))

SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "scaler.pkl")
scaler = pickle.load(open(SCALER_PATH, "rb"))

# ✅ Define the exact feature names used during training
feature_columns = [
    "Month_Prenatal_Care_Began",
    "Cigarettes_Before_Pregnancy",
    "BMI_prepregnancy",
    "Prepregnancy_Diabetes",
    "Gestational_Diabetes",
    "Prepregnancy_Hypertension",
]

# Load historical data if the file exists
HISTORICAL_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "cleaned_dataset.csv")
if os.path.exists(HISTORICAL_DATA_PATH):
    original_historical_data = pd.read_csv(HISTORICAL_DATA_PATH)
else:
    original_historical_data = pd.DataFrame(columns=feature_columns)

# Define cluster labels
cluster_labels = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

def calculate_cluster_characteristics(data):
    """
    Calculate the mean feature values for each cluster and generate a summary.
    """
    # Group the data by cluster and calculate the mean of each feature
    cluster_stats = data.groupby("Cluster_Label")[feature_columns].mean().reset_index()

    # Generate a summary for each cluster
    cluster_summary = {}
    for _, row in cluster_stats.iterrows():
        cluster_label = row["Cluster_Label"]
        summary = {
            "Month_Prenatal_Care_Began": row["Month_Prenatal_Care_Began"],
            "Cigarettes_Before_Pregnancy": row["Cigarettes_Before_Pregnancy"],
            "BMI_prepregnancy": row["BMI_prepregnancy"],
            "Prepregnancy_Diabetes": row["Prepregnancy_Diabetes"],
            "Gestational_Diabetes": row["Gestational_Diabetes"],
            "Prepregnancy_Hypertension": row["Prepregnancy_Hypertension"],
        }
        cluster_summary[cluster_label] = summary

    return cluster_summary

def create_plot_data(data):
    """
    Helper function to create Plotly visualization data, calculate cluster distribution,
    and generate cluster characteristics.
    """
    # Predict clusters for all data points
    features_scaled = scaler.transform(data[feature_columns])  # Use only feature columns
    features_pca = pca_model.transform(features_scaled)
    prediction = kmeans_model.predict(features_pca)

    # Add cluster labels to the data
    data["Cluster"] = prediction
    data["Cluster_Label"] = data["Cluster"].map(cluster_labels)

    # Calculate cluster distribution
    cluster_distribution = data["Cluster_Label"].value_counts(normalize=True).mul(100).round(2).to_dict()

    # Calculate cluster characteristics
    cluster_characteristics = calculate_cluster_characteristics(data)

    # Define colors for each cluster (matching the 3D scatter plot)
    cluster_colors = {
        "Low Risk": "#440154",  # Dark purple (Cluster 0)
        "Medium Risk": "#21918c",  # Teal (Cluster 1)
        "High Risk": "#fde725",  # Yellow (Cluster 2)
    }

    # Create a 3D scatter plot using Plotly
    scatter = go.Scatter3d(
        x=features_pca[:, 0].tolist(),  # Convert to list
        y=features_pca[:, 1].tolist(),  # Convert to list
        z=features_pca[:, 2].tolist(),  # Convert to list
        mode='markers',
        marker=dict(
            size=5,
            color=prediction.tolist(),  # Convert to list
            colorscale='Viridis',  # Use a color scale
            opacity=0.8,
            colorbar=dict(
                title=dict(
                    text="Risk Level",  # Title for the color bar
                    side="right"  # Position the title on the right
                ),
                tickvals=[0, 1, 2],  # Tick values for the color bar
                ticktext=["Low Risk", "Medium Risk", "High Risk"],  # Labels for the ticks
                len=0.5,  # Length of the color bar
                thickness=15,  # Thickness of the color bar
            )
        ),
        text=data["Cluster_Label"].tolist(),  # Convert to list
        hoverinfo='text'  # Show only the hover text
    )

    # Layout for the 3D scatter plot
    scatter_layout = go.Layout(
        scene=dict(
            xaxis_title='PCA 1',
            yaxis_title='PCA 2',
            zaxis_title='PCA 3'
        ),
        title="K-Means Clustering of Maternal Health Data in 3D",
        margin=dict(l=0, r=100, b=0, t=30),  # Adjust margins to make space for the color bar
        coloraxis=dict(colorbar=dict(title="Risk Level"))  # Add color axis for consistency
    )

    # Create hover text for the bar chart
    hover_text = []
    for label in cluster_distribution.keys():
        stats = cluster_characteristics[label]
        hover_text.append(
            f"<b>{label}</b><br>"
            f"Month Prenatal Care Began: {stats['Month_Prenatal_Care_Began']:.2f}<br>"
            f"Cigarettes Before Pregnancy: {stats['Cigarettes_Before_Pregnancy']:.2f}<br>"
            f"BMI (Pre-pregnancy): {stats['BMI_prepregnancy']:.2f}<br>"
            f"Pre-pregnancy Diabetes: {stats['Prepregnancy_Diabetes']:.2f}<br>"
            f"Gestational Diabetes: {stats['Gestational_Diabetes']:.2f}<br>"
            f"Pre-pregnancy Hypertension: {stats['Prepregnancy_Hypertension']:.2f}"
        )

    # Create a bar chart for cluster distribution
    bar_chart = go.Bar(
        x=list(cluster_distribution.keys()),  # Cluster labels
        y=list(cluster_distribution.values()),  # Percentages
        text=list(cluster_distribution.values()),  # Display percentages on bars
        textposition='auto',  # Automatically position text
        marker=dict(
            color=[cluster_colors[label] for label in cluster_distribution.keys()]  # Use cluster colors
        ),
        opacity=0.8,
        name="Cluster Distribution",
        hoverinfo="text",  # Show hover text
        hovertext=hover_text  # Add hover text
    )

    # Layout for the bar chart
    bar_layout = go.Layout(
        title="Cluster Distribution (Risk Group Distribution)",
        xaxis=dict(title="Risk Level"),
        yaxis=dict(title="Percentage (%)"),
        margin=dict(l=50, r=50, b=50, t=50),
        showlegend=False
    )

    # Convert the Plotly graphs to JSON-serializable format
    return {
        "scatter_data": [scatter.to_plotly_json()],  # Convert Scatter3d to JSON
        "scatter_layout": scatter_layout.to_plotly_json(),  # Convert Layout to JSON
        "bar_data": [bar_chart.to_plotly_json()],  # Convert Bar chart to JSON
        "bar_layout": bar_layout.to_plotly_json(),  # Convert Bar layout to JSON
        "cluster_distribution": cluster_distribution,  # Add cluster distribution
        "cluster_characteristics": cluster_characteristics  # Add cluster characteristics
    }

@unsupervised_bp.route('/get_initial_data', methods=['GET'])
def get_initial_data():
    try:
        # Create the initial plot data using historical data
        plot_data = create_plot_data(original_historical_data)
        return jsonify({
            "scatter_data": plot_data["scatter_data"],
            "scatter_layout": plot_data["scatter_layout"],
            "bar_data": plot_data["bar_data"],
            "bar_layout": plot_data["bar_layout"],
            "cluster_distribution": plot_data["cluster_distribution"],  # Include cluster distribution
            "cluster_characteristics": plot_data["cluster_characteristics"]  # Include cluster characteristics
        })
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    unsupervised_bp.run(debug=True)