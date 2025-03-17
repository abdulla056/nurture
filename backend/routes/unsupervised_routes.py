import pickle
import pandas as pd
import plotly.graph_objs as go
import os
from flask import Flask, jsonify, Blueprint
import firebase_admin
from firebase_admin import credentials, firestore
from config import Config

# Load Firebase credentials from environment variable
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

# Initialize Firebase app if not already initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

unsupervised_bp = Blueprint('unsupervised_bp', __name__)

# Load trained models and scaler
KMEANS_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "kmeans_model.pkl")
kmeans_model = pickle.load(open(KMEANS_MODEL_PATH, "rb"))

PCA_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "pca.pkl")
pca_model = pickle.load(open(PCA_MODEL_PATH, "rb"))

SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "scaler.pkl")
scaler = pickle.load(open(SCALER_PATH, "rb"))

# Define the exact feature names used during training
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

# Global variable to store the latest visualization data
latest_plot_data = None

def calculate_cluster_characteristics(data):
    """
    Calculate the mean feature values for each cluster and generate a summary.
    """
    cluster_stats = data.groupby("Cluster_Label")[feature_columns].mean().reset_index()
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
    Create Plotly visualization data, calculate cluster distribution, and generate cluster characteristics.
    """
    try:
        # Drop rows with missing values
        data = data.dropna()

        # Predict clusters for all data points
        features_scaled = scaler.transform(data[feature_columns])
        features_pca = pca_model.transform(features_scaled)
        prediction = kmeans_model.predict(features_pca)

        # Add cluster labels to the data
        data["Cluster"] = prediction
        data["Cluster_Label"] = data["Cluster"].map(cluster_labels)

        # Calculate cluster distribution
        cluster_distribution = data["Cluster_Label"].value_counts(normalize=True).mul(100).round(2).to_dict()

        # Calculate cluster characteristics
        cluster_characteristics = calculate_cluster_characteristics(data)

        # Create a 3D scatter plot
        scatter = go.Scatter3d(
            x=features_pca[:, 0].tolist(),
            y=features_pca[:, 1].tolist(),
            z=features_pca[:, 2].tolist(),
            mode='markers',
            marker=dict(
                size=5,
                color=prediction.tolist(),
                colorscale='Viridis',
                opacity=0.8,
                colorbar=dict(
                    title=dict(text="Risk Level", side="right"),
                    tickvals=[0, 1, 2],
                    ticktext=["Low Risk", "Medium Risk", "High Risk"],
                    len=0.5,
                    thickness=15,
                )
            ),
            text=data["Cluster_Label"].tolist(),
            hoverinfo='text'
        )

        # Layout for the 3D scatter plot
        scatter_layout = go.Layout(
            scene=dict(
                xaxis_title='PCA 1',
                yaxis_title='PCA 2',
                zaxis_title='PCA 3'
            ),
            title="K-Means Clustering of Maternal Health Data in 3D",
            margin=dict(l=0, r=100, b=0, t=30),
            coloraxis=dict(colorbar=dict(title="Risk Level"))
        )

        # Create hover text for the bar chart
        hover_text = [
            f"<b>{label}</b><br>"
            f"Month Prenatal Care Began: {stats['Month_Prenatal_Care_Began']:.2f}<br>"
            f"Cigarettes Before Pregnancy: {stats['Cigarettes_Before_Pregnancy']:.2f}<br>"
            f"BMI (Pre-pregnancy): {stats['BMI_prepregnancy']:.2f}<br>"
            f"Pre-pregnancy Diabetes: {stats['Prepregnancy_Diabetes']:.2f}<br>"
            f"Gestational Diabetes: {stats['Gestational_Diabetes']:.2f}<br>"
            f"Pre-pregnancy Hypertension: {stats['Prepregnancy_Hypertension']:.2f}"
            for label, stats in cluster_characteristics.items()
        ]

        # Create a bar chart for cluster distribution
        bar_chart = go.Bar(
            x=list(cluster_distribution.keys()),
            y=list(cluster_distribution.values()),
            text=list(cluster_distribution.values()),
            textposition='auto',
            marker=dict(color=["#440154", "#21918c", "#fde725"]),  # Cluster colors
            opacity=0.8,
            hoverinfo="text",
            hovertext=hover_text
        )

        # Layout for the bar chart
        bar_layout = go.Layout(
            title="Cluster Distribution (Risk Group Distribution)",
            xaxis=dict(title="Risk Level"),
            yaxis=dict(title="Percentage (%)"),
            margin=dict(l=50, r=50, b=50, t=50),
            showlegend=False
        )

        return {
            "scatter_data": [scatter.to_plotly_json()],
            "scatter_layout": scatter_layout.to_plotly_json(),
            "bar_data": [bar_chart.to_plotly_json()],
            "bar_layout": bar_layout.to_plotly_json(),
            "cluster_distribution": cluster_distribution,
            "cluster_characteristics": cluster_characteristics
        }
    except Exception as e:
        print("❌ Error creating plot data:", str(e))
        raise e

def update_dataset_with_firestore_data():
    """
    Fetch data from Firestore, extract required fields, and update the dataset.
    """
    try:
        # Fetch all documents in the 'details' collection
        docs = db.collection('details').stream()

        # Extract required fields from each document
        new_rows = []
        for doc in docs:
            doc_data = doc.to_dict()  # Convert document to a dictionary
            new_row = {
                "Month_Prenatal_Care_Began": doc_data.get("lifestyleFactors", {}).get("monthPrenatalCareBegan", None),
                "Cigarettes_Before_Pregnancy": doc_data.get("lifestyleFactors", {}).get("cigarettesBeforePregnancy", None),
                "BMI_prepregnancy": doc_data.get("riskData", {}).get("prepregnancyWeightRecode", None),
                "Prepregnancy_Diabetes": doc_data.get("riskData", {}).get("prePregnancyDiabetes", None),
                "Gestational_Diabetes": doc_data.get("riskData", {}).get("gestationalDiabetes", None),
                "Prepregnancy_Hypertension": doc_data.get("riskData", {}).get("prePregnancyHypertension", None),
            }
            new_rows.append(new_row)

        # Load the existing dataset
        historical_data = pd.read_csv(HISTORICAL_DATA_PATH) if os.path.exists(HISTORICAL_DATA_PATH) else pd.DataFrame(columns=feature_columns)

        # Append new rows to the dataset
        updated_data = pd.concat([historical_data, pd.DataFrame(new_rows)], ignore_index=True).dropna()
        updated_data.to_csv(HISTORICAL_DATA_PATH, index=False)

        return updated_data
    except Exception as e:
        print("❌ Error updating dataset with Firestore data:", str(e))
        raise e

def setup_firestore_listener():
    """
    Set up a Firestore listener to update the dataset in real-time.
    """
    def on_snapshot(doc_snapshot, changes, read_time):
        try:
            print("🔥 Firestore update detected!")
            updated_data = update_dataset_with_firestore_data()
            global latest_plot_data
            latest_plot_data = create_plot_data(updated_data)
            print("✅ Dataset and visualizations updated successfully!")
        except Exception as e:
            print("❌ Error updating dataset and visualizations:", str(e))

    db.collection('details').on_snapshot(on_snapshot)

# Call the listener setup function when the backend starts
setup_firestore_listener()

@unsupervised_bp.route('/update_and_visualize', methods=['GET'])
def update_and_visualize():
    """
    Return the latest visualization data.
    """
    try:
        global latest_plot_data
        if latest_plot_data is None:
            updated_data = update_dataset_with_firestore_data()
            latest_plot_data = create_plot_data(updated_data)

        return jsonify({
            "scatter_data": latest_plot_data["scatter_data"],
            "scatter_layout": latest_plot_data["scatter_layout"],
            "bar_data": latest_plot_data["bar_data"],
            "bar_layout": latest_plot_data["bar_layout"],
            "cluster_distribution": latest_plot_data["cluster_distribution"],
            "cluster_characteristics": latest_plot_data["cluster_characteristics"]
        })
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    unsupervised_bp.run(debug=True)