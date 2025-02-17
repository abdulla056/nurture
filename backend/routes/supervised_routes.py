from flask import Flask, request, jsonify, Blueprint # type: ignore
import numpy as np # type: ignore
import joblib # type: ignore
import os
from flask_cors import CORS  # Allow cross-origin requests
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
supervised_bp = Blueprint('supervised_bp', __name__)

# Load trained model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best_DEMOoverall_model.pkl")
model = joblib.load(MODEL_PATH)

SCALER_PATH = os.path.join(os.path.dirname(__file__), "models", "DEMOscaler.pkl")
scaler = joblib.load(SCALER_PATH)

@supervised_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        raw_features = np.array(data["features"]).reshape(1, -1)

        # Ensure input is scaled correctly
        scaled_features = scaler.transform(raw_features.astype(float))

        # Make prediction
        prediction = model.predict(scaled_features).tolist()

        # Check if model has probability prediction capability
        confidence = None
        if hasattr(model, "predict_proba"):
            confidence = model.predict_proba(scaled_features).max().item()

        return jsonify({
            "Expected outcome": prediction[0],
            "Confidence": confidence if confidence is not None else 0.0  # Ensure confidence is always a number
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error response with status code 500
