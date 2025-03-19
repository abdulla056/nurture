from flask import Flask, request, jsonify, Blueprint  # type: ignore
import numpy as np  # type: ignore
import pandas as pd  # type: ignore
import joblib
from flask_cors import CORS
from lime.lime_tabular import LimeTabularExplainer
import traceback
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Set the backend to 'Agg'
import matplotlib.pyplot as plt  # Corrected import
import os
import firebase_admin  # type: ignore
from firebase_admin import credentials, firestore  # type: ignore
import json
import uuid
from config import Config
import logging  # Added import
from auth.firebase import get_next_id 
from routes.authentication_routes import protected_route
from datetime import datetime
from auth.rate_limiter import rate_limit
import logging

# Load Firebase credentials from environment variable
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()

supervised_bp = Blueprint('supervised_bp', __name__)

super_logger = logging.getLogger('supervised_logger')

# Load trained models and scalers
DEMO_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_DEMOoverall_model.pkl")
DEMOmodel = joblib.load(DEMO_MODEL_PATH)
DEMO_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "DEMOscaler.pkl")
DEMOscaler = joblib.load(DEMO_SCALER_PATH)

LF_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_LFoverall_model.pkl")
LFmodel = joblib.load(LF_MODEL_PATH)
LF_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "LFscaler.pkl")
LFscaler = joblib.load(LF_SCALER_PATH)

RISK_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_RiskFactorsoverall_model.pkl")
RISKmodel = joblib.load(RISK_MODEL_PATH)
RISK_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "RiskFactorsscaler.pkl")
RISKscaler = joblib.load(RISK_SCALER_PATH)

# Feature names for LIME explanation
demographics = ['Delivery_Year', 'Delivery_Month', 'Weekday', 'Mothers_Age_1', 'Mothers_Race_Recode6', 'Mothers_Education_Revised',
                'Mothers_Height_in_Inches', 'Prepregnancy_Weight_Recode', 'Fathers_Combined_Age', 'Sex_of_Infant', 'Birth_Weight_Detail_in_Grams']

lifestyle_factors = ['WIC_Status', 'Cigarettes_Before_Pregnancy', 'Cigarettes_First_Trimester', 'Cigarettes_Second_Trimester',
                     'Cigarettes_Third_Trimester', 'Tobacco_Use', 'Month_Prenatal_Care_Began', 'BMI_prepregnancy']

risk_factors = ['Prepregnancy_Diabetes', 'Gestational_Diabetes', 'Prepregnancy_Hypertension',
                'Gestational_Hypertension', 'Hypertension_Eclampsia', 'Infertility_Treatment', 'Fertility_Enhancing_Drugs',
                'Asst_Reproductive_Technology', 'Previous_Cesareans', 'Ruptured_Uterus',
                'Admit_to_Intensive_Care', 'Was_Histological_Placental_Exam_Performed']

# Load full training data
FULL_TRAINING_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "preprocessed_data.csv")
full_training_data = pd.read_csv(FULL_TRAINING_DATA_PATH)

# Initialize LIME Explainers
demoexplainer = LimeTabularExplainer(training_data=DEMOscaler.transform(full_training_data[demographics]), feature_names=demographics, class_names=['No Risk', 'At Risk'], mode='classification')
lfexplainer = LimeTabularExplainer(training_data=LFscaler.transform(full_training_data[lifestyle_factors]), feature_names=lifestyle_factors, class_names=['No Risk', 'At Risk'], mode='classification')
riskexplainer = LimeTabularExplainer(training_data=RISKscaler.transform(full_training_data[risk_factors]), feature_names=risk_factors, class_names=['No Risk', 'At Risk'], mode='classification')

# Define the prediction labels mapping globally
prediction_labels = {
    0: "Congenital Malformations",
    1: "Maternal Conditions Unrelated to Pregnancy",
    2: "Placental Cord and Membrane Complications",
    3: "Maternal Complication"
}

def predict_and_explain(category, features):
    if category == "0":
        model, scaler, explainer, feature_names = DEMOmodel, DEMOscaler, demoexplainer, demographics
    elif category == "1":
        model, scaler, explainer, feature_names = LFmodel, LFscaler, lfexplainer, lifestyle_factors
    elif category == "2":
        model, scaler, explainer, feature_names = RISKmodel, RISKscaler, riskexplainer, risk_factors
    else:
        raise ValueError("Invalid category provided")
    
    features_array = np.array(features).reshape(1, -1)
    features_df = pd.DataFrame(features_array, columns=feature_names, dtype=float)
    scaled_features = scaler.transform(features_df)
    prediction_numeric = model.predict(scaled_features).tolist()[0]
    confidence = round(model.predict_proba(scaled_features).max().item(),4) if hasattr(model, "predict_proba") else 1.0
    
    # Map the numerical prediction to the corresponding label
    prediction_label = prediction_labels.get(prediction_numeric, "Unknown")

    explanation = explainer.explain_instance(
        data_row=features_df.iloc[0].values,  # Use original, unscaled data
        predict_fn=model.predict_proba
    )
    fig = explanation.as_pyplot_figure()
    plt.title("LIME Explanation")
    plt.tight_layout()
    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()
    
    explanation_list = explanation.as_list()
    total_weight = sum(abs(weight) for _, weight in explanation_list)
    feature_weight_map = {(feature.split("<")[0].split(">")[0].strip().replace("_", " ")): round(abs(weight) /total_weight * 100,2) for feature, weight in explanation_list}

    return prediction_label, confidence, image_base64, feature_weight_map

@supervised_bp.route("/predict_and_explain", methods=["POST"])
@rate_limit(max_requests=10, window_size=60) 
def predict_and_explain_route():  
    try:
        response = protected_route(request, 'post')

        if response['valid']:
            data = request.get_json()
            patientId = data.get("patientId")
            category = data.get("category")
            features = [float(feature) for feature in data.get("features", [])]
            if not category or not features:
                super_logger.error(f"Invalid input data provided by DoctorID: {response['user_id']}, IP: {request.remote_addr}")
                return jsonify({"error": "Invalid input data"}), 400
            
            # Get prediction and explanation
            prediction_label, confidence, image_base64, feature_weight_map = predict_and_explain(category, features)
            
            predictionId = get_next_id("prediction")
            
            # Store the decoded label, confidence, explanation, and other data in Firestore
            db.collection('predictions').document(predictionId).set({
                'predictionId': predictionId,
                'patientId': patientId,
                'doctorId': response['user_id'],
                'detailId' : data.get('detailId'),
                "prediction": prediction_label,  # Store the decoded label (e.g., "Congenital Malformations")
                "confidence": confidence,
                "timestamp": datetime.utcnow(),
                "explanationText": feature_weight_map,
                "explanationImage": image_base64
            })
            
            db.collection("predictionFeature").document(predictionId).set({
            "Category": category,
            "Features": features,  # Store the decoded label (e.g., "Congenital Malformations")
            "timestamp": firestore.SERVER_TIMESTAMP,
            })

            super_logger.info(f"Prediction made by DoctorID: {response['user_id']} with PredictionID: {predictionId}, IP: {request.remote_addr}")

            # Return the response with the decoded label and explanation
            return jsonify({
                "expectedOutcome": prediction_label,  # Return the decoded label
                "confidence": confidence,
                "documentId": predictionId,
                "explanationImage": image_base64,
                "explanationText": feature_weight_map,
                "patientId": patientId,
                "doctorId": response['user_id'], 
                "predictionId": predictionId
            }), 200
        else:
            super_logger.warning(f"Unauthorized attempt to make prediction by IP: {request.remote_addr}")
            return jsonify({"error": "Unauthorized"}), 401
    except Exception as e:
        traceback.print_exc()
        super_logger.error(f"Error making prediction: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 500
    
@supervised_bp.route('/get_model_performance', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_model_performance():
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            doc_ref = db.collection('modelPerformance').document('modelPerformance')
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                print("Fetched Model Performance Data:", data)  # Debugging
                super_logger.info(f"Model performance data retrieved by Doctor {response['user_id']}, IP: {request.remote_addr}")
                return jsonify(data)
            else:
                super_logger.warning(f"Model performance data not found requested by Doctor {response['user_id']}, IP: {request.remote_addr}")
                print("Firestore document not found!")
                return jsonify({"error": "Document not found"}), 404
        else:
            super_logger.warning(f"Unauthorized attempt to make prediction by IP: {request.remote_addr}")
            return jsonify({"error": "Unauthorized"}), 401
    except Exception as e:
        super_logger.error(f"Error getting model performance data: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 500
