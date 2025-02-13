from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS  # Allow cross-origin requests

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load trained model and scaler
model = joblib.load("D:/Taylors/Y3S5/Capstone Project 1/best_DEMOoverall_model.pkl")
scaler = joblib.load("D:/Taylors/Y3S5/Capstone Project 1/DEMOscaler.pkl")

@app.route("/predict", methods=["POST"])
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

if __name__ == "__main__":
    app.run(debug=True)
