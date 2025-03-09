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

def create_plot_data(data):
    """
    Helper function to create Plotly visualization data.
    """
    # Predict clusters for all data points
    features_scaled = scaler.transform(data[feature_columns])  # Use only feature columns
    features_pca = pca_model.transform(features_scaled)
    prediction = kmeans_model.predict(features_pca)

    # Add cluster labels to the data
    data["Cluster"] = prediction
    data["Cluster_Label"] = data["Cluster"].map(cluster_labels)

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

    layout = go.Layout(
        scene=dict(
            xaxis_title='PCA 1',
            yaxis_title='PCA 2',
            zaxis_title='PCA 3'
        ),
        title="K-Means Clustering of Maternal Health Data in 3D",
        margin=dict(l=0, r=100, b=0, t=30),  # Adjust margins to make space for the color bar
        coloraxis=dict(colorbar=dict(title="Risk Level"))  # Add color axis for consistency
    )

    # Convert the Plotly graph to a JSON-serializable format
    return {
        "data": [scatter.to_plotly_json()],  # Convert Scatter3d to JSON
        "layout": layout.to_plotly_json()  # Convert Layout to JSON
    }

@unsupervised_bp.route('/get_initial_data', methods=['GET'])
def get_initial_data():
    try:
        # Create the initial plot data using historical data
        plot_data = create_plot_data(original_historical_data)
        return jsonify({
            "plot_data": plot_data
        })
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

@unsupervised_bp.route('/get_all_data', methods=['GET'])
def get_all_data():
    try:
        # Return the entire dataset as JSON
        all_data = original_historical_data.to_dict(orient='records')
        return jsonify({
            "all_data": all_data
        })
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    unsupervised_bp.run(debug=True)