<<<<<<< HEAD
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from flask_cors import CORS
from lime.lime_tabular import LimeTabularExplainer
import traceback
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Set the backend to 'Agg'
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
CORS(app)

# Load trained models and scalers
DEMO_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..","models","best_DEMOoverall_model.pkl")
DEMOmodel = joblib.load(DEMO_MODEL_PATH)
DEMO_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..","models","DEMOscaler.pkl")
DEMOscaler = joblib.load(DEMO_SCALER_PATH)

LF_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..","models","best_LFoverall_model.pkl")
LFmodel = joblib.load(LF_MODEL_PATH)
LF_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..","models","LFscaler.pkl")
LFscaler = joblib.load(LF_SCALER_PATH)

RISK_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..","models","best_RiskFactorsoverall_model.pkl")
RISKmodel = joblib.load(RISK_MODEL_PATH)
RISK_SCALER_PATH = os.path.join(os.path.dirname(__file__), "..","models","RiskFactorsscaler.pkl")
RISKscaler = joblib.load(RISK_SCALER_PATH)

# Feature names for LIME explanation
demographics = ['Delivery_Year', 'Delivery_Month', 'Weekday', 'Mothers_Age_1', 'Mothers_Race_Recode6', 'Mothers_Education_Revised', 
                'Mothers_Height_in_Inches', 'Prepregnancy_Weight_Recode', 'Fathers_Combined_Age', 'Sex_of_Infant', 'Birth_Weight_Detail_in_Grams']

lifestyle_factors = ['WIC_Status', 'Cigarettes_Before_Pregnancy', 'Cigarettes_First_Trimester', 'Cigarettes_Second_Trimester', 
                     'Cigarettes_Third_Trimester', 'Tobacco_Use', 'Month_Prenatal_Care_Began', 'BMI_prepregnancy']

risk_factors = ['Prepregnancy_Diabetes', 'Gestational_Diabetes', 'Prepregnancy_Hypertension', 
                'Gestational_Hypertension', 'Hypertension_Eclampsia', 'Infertility_Treatment', 'Fertility_Enhancing_Drugs', 
                'Asst_Reproductive_Technology', 'Previous_Cesareans', 'Ruptured_Uterus', 
                'Admit_to_Intensive_Care', 'Was_Autopsy_Performed', 'Was_Histological_Placental_Exam_Performed']

# Load full training data
FULL_TRAINING_DATA_PATH = os.path.join(os.path.dirname(__file__), "..","models","preprocessed_data.csv")
full_training_data = pd.read_csv(FULL_TRAINING_DATA_PATH)

# Initialize LIME Explainers
demoexplainer = LimeTabularExplainer(training_data=DEMOscaler.transform(full_training_data[demographics]), feature_names=demographics, class_names=['No Risk', 'At Risk'], mode='classification')
lfexplainer = LimeTabularExplainer(training_data=LFscaler.transform(full_training_data[lifestyle_factors]), feature_names=lifestyle_factors, class_names=['No Risk', 'At Risk'], mode='classification')
riskexplainer = LimeTabularExplainer(training_data=riskscaler.transform(full_training_data[risk_factors]), feature_names=risk_factors, class_names=['No Risk', 'At Risk'], mode='classification')

def predict(model, scaler, features, feature_names):
    features_array = np.array(features).reshape(1, -1)
    features_df = pd.DataFrame(features_array, columns=feature_names, dtype=float)
    scaled_features = scaler.transform(features_df)
    prediction = model.predict(scaled_features).tolist()
    confidence = model.predict_proba(scaled_features).max().item() if hasattr(model, "predict_proba") else 1.0
    return prediction[0], confidence

def explain(explainer, model, scaler, features, feature_names):
    features_array = np.array(features).reshape(1, -1)
    features_df = pd.DataFrame(features_array, columns=feature_names)
    scaled_features = scaler.transform(features_df)
    explanation = explainer.explain_instance(data_row=scaled_features[0], predict_fn=model.predict_proba)
    fig = explanation.as_pyplot_figure()
    plt.title("LIME Explanation")
    plt.tight_layout()
    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()
    return image_base64

@app.route("/demopredict", methods=["POST"])
def demopredict():
    try:
        data = request.get_json()
        prediction, confidence = predict(DEMOmodel, DEMOscaler, data["features"], demographics)
        return jsonify({"Expected outcome": prediction, "Confidence": confidence})
    except Exception as e:
        print("Error in /demopredict:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/demoexplain", methods=["POST"])
def demoexplain():
    try:
        data = request.get_json()
        image_base64 = explain(demoexplainer, DEMOmodel, DEMOscaler, data["features"], demographics)
        return jsonify({"explanation_image": image_base64})
    except Exception as e:
        print("Error in /demoexplain:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


#Lifestyle
@app.route("/LFpredict", methods=["POST"])
def LFpredict():
    try:
        data = request.get_json()
        prediction, confidence = predict(LFmodel, LFscaler, data["features"], lifestyle_factors)
        return jsonify({"Expected outcome": prediction, "Confidence": confidence})
    except Exception as e:
        print("Error in /LFpredict:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/LFexplain", methods=["POST"])
def LFexplain():
    try:
        data = request.get_json()
        image_base64 = explain(lfexplainer, LFmodel, LFscaler, data["features"], lifestyle_factors)
        return jsonify({"explanation_image": image_base64})
    except Exception as e:
        print("Error in /LFexplain:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

##risk
@app.route("/riskpredict", methods=["POST"])
def riskpredict():
    try:
        data = request.get_json()
        prediction, confidence = predict(riskmodel, riskscaler, data["features"], risk_factors)
        return jsonify({"Expected outcome": prediction, "Confidence": confidence})
    except Exception as e:
        print("Error in /riskpredict:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/riskexplain", methods=["POST"])
def riskexplain():
    try:
        data = request.get_json()
        image_base64 = explain(riskexplainer, riskmodel, riskscaler, data["features"], risk_factors)
        return jsonify({"explanation_image": image_base64})
    except Exception as e:
        print("Error in /riskexplain:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
=======
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
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..","models", "best_DEMOoverall_model.pkl")
model = joblib.load(MODEL_PATH)

SCALER_PATH = os.path.join(os.path.dirname(__file__), "..","models", "DEMOscaler.pkl")
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
>>>>>>> main
