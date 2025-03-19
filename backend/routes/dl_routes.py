from flask import request, Blueprint, jsonify
import numpy as np
import pandas as pd
from tensorflow import keras 
import joblib
import os
import json

# Load the default features JSON file
json_path = os.path.join(os.path.dirname(__file__), "..", "models", "default_features.json")
with open(json_path, "r") as f:
    default_features = json.load(f)


# Load the trained model and preprocessing objects
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "dlmodel.keras")
model = keras.models.load_model(model_path)

# Load mean values from the .pkl file
mean_path = os.path.join(os.path.dirname(__file__), "..", "models", "mean_values.pkl")
mean = joblib.load(mean_path)

# Load continuous features from the file
continuous_features_path = os.path.join(os.path.dirname(__file__), "..", "models", "continuous_features.pkl")
continuous_features = joblib.load(continuous_features_path)

# Load mode values from the .pkl file
mode_path = os.path.join(os.path.dirname(__file__), "..", "models", "mode_values.pkl")
mode = joblib.load(mode_path)

# Load categorical features from the file
categorical_features_path = os.path.join(os.path.dirname(__file__), "..", "models", "categorical_features.pkl")
categorical_features = joblib.load(categorical_features_path)

# Load scaler from the .pkl file
scaler_path = os.path.join(os.path.dirname(__file__), "..", "models", "minmax_scaler.pkl")
scaler = joblib.load(scaler_path)


# Load one hot encoder from the .pkl file
ohe_path = os.path.join(os.path.dirname(__file__), "..", "models", "ohe_encoder.pkl")
ohe = joblib.load(ohe_path)

# Load label encoder from the .pkl file
le_path = os.path.join(os.path.dirname(__file__), "..", "models", "label_encoders.pkl")
le = joblib.load(le_path)

# Load nominal features from the .pkl file
nominal_features_path = os.path.join(os.path.dirname(__file__), "..", "models", "nominal_features.pkl")
nominal_features = joblib.load(nominal_features_path)


dl_bp = Blueprint('dl_bp', __name__)

# Features to drop (same as during training)
features_to_drop = [
    'Mothers_Age_Imputed', 'Reported_Age_of_Mother_Flag', 'Mothers_Race_Imputed',
    'Fathers_Reported_Age_Used_Flag', 'Plurality_Imputed', 'Sex_Imputed',
    'Gestation_Imputed_Flag', 'Obstetric_Estimate_of_Gestation_Used_Flag',
    'Combined_Gestation_Used_Flag', 'Mothers_Bridged_Race_Recode', 'Version',
    'Initiating_Fetal_Recode_124', 'Init_Cause_or_condition'
]

# Define mapping for categorical features
binary_mapping = {"Y": 1, "N": 0, "X": 2}

# List of features that require mapping
mapped_features = [
    "Prepregnancy_Diabetes",
    "Gestational_Diabetes",
    "Prepregnancy_Hypertension",
    "Gestational_Hypertension",
    "Hypertension_Eclampsia",
    "Infertility_Treatment",
    "Fertility_Enhancing_Drugs",
    "Asst_Reproductive_Technology",
    "Previous_Cesareans",
    "Ruptured_Uterus",
    "Admit_to_Intensive_Care",
    "Was_Autopsy_Performed",
    "Was_Histological_Placental_Exam_Performed",
    "WIC_Status"
]

# Special case: Mapping for "Sex_of_Infant"
sex_mapping = {"M": 1, "F": 0}  # Male = 1, Female = 0


def preprocess_input(data):
    # Convert input data to a DataFrame
    df = pd.DataFrame([data])
    print(df)

    # Apply mappings to categorical features
    for feature in mapped_features:
        if feature in df.columns:
            df[feature] = df[feature].map(binary_mapping)

    # Apply special mapping for "Sex_of_Infant"
    if "Sex_of_Infant" in df.columns:
        df["Sex_of_Infant"] = df["Sex_of_Infant"].map(sex_mapping)

    # Drop unnecessary features
    df.drop(columns=features_to_drop, errors='ignore', inplace=True)
    print(df)
    
    # Fill missing values in continuous features using the saved mean values
    df[continuous_features] = df[continuous_features].fillna(mean)

    print(df[continuous_features])

    # Fill missing values in categorical features using the saved mode values
    df[categorical_features] = df[categorical_features].fillna(mode)

    print(df[categorical_features])


    normalized_data = df[continuous_features].copy()
    normalized_data = scaler.transform(normalized_data)


    df[continuous_features] = normalized_data

    print(df[continuous_features].to_string())

    print(df.to_string())

    # Apply one-hot encoding to nominal features
    nominal_encoded = ohe.transform(df[nominal_features])
    nominal_encoded_df = pd.DataFrame(
        nominal_encoded, 
        columns=ohe.get_feature_names_out(nominal_features),
        index=df.index
    )

    # Drop original nominal features and concatenate the one-hot encoded DataFrame
    df = pd.concat([df.drop(columns=nominal_features), nominal_encoded_df], axis=1)

    print(df.to_string())

    ordinal_feature = ['Estimated_Time_of_Fetal_Death']

    # Apply label encoding to ordinal features
    for feature in ordinal_feature:
        df[feature] = le.transform(df[feature].astype(str))


    df.drop(columns=['Initiating_Cause_or_Condition_Code_High Risk', 
             'Initiating_Cause_or_Condition_Code_Medium Risk', 
             'Initiating_Cause_or_Condition_Code_Low Risk',
             'Initiating_Cause_or_Condition_Code_Rare Cases',
             'Initiating_Cause_or_Condition_Code_Unknown Cause'], errors='ignore', inplace=True)

    print(df.to_string())
    print(df.shape)

    return df

# Define mapping
value_mapping = {
    0: "N",  # No
    1: "Y",  # Yes
    2: "U",  # Unknown
    3: "X"   # Not applicable
}

# Define the categorical features to be mapped
categorical_features = {
    "sexOfInfant": "Sex_of_Infant",
    "prePregnancyDiabetes": "Prepregnancy_Diabetes",
    "gestationalDiabetes": "Gestational_Diabetes",
    "prePregnancyHypertension": "Prepregnancy_Hypertension",
    "gestationalHypertension": "Gestational_Hypertension",
    "hypertensionEclampsia": "Hypertension_Eclampsia",
    "infertilityTreatment": "Infertility_Treatment",
    "fertilityEnhancingDrugs": "Fertility_Enhancing_Drugs",
    "assistedReproductiveTechnology": "Asst_Reproductive_Technology",
    "previousCesareans": "Previous_Cesareans",
    "rupturedUterus": "Ruptured_Uterus",
    "admitToIntensiveCare": "Admit_to_Intensive_Care",
    "wasAutopsyPerformed": "Was_Autopsy_Performed",
    "histologicalPlacentalExam": "Was_Histological_Placental_Exam_Performed",
    "wicStatus": "WIC_Status"
}


def map_categorical_values(data):
    """Convert categorical feature values to their mapped labels."""
    mapped_data = {}

    for key, value in data.items():
        if key in categorical_features:  
            mapped_key = categorical_features[key]  # Get mapped key name
            mapped_value = value_mapping.get(value, "U")  # Default to "U" if unknown
            mapped_data[mapped_key] = mapped_value
        else:
            mapped_data[key] = value  # Keep numerical features unchanged

    return mapped_data
    
@dl_bp.route('/predict', methods=['POST'])
def predict(request_data):
    

    merged_data = {**default_features}

    for d in request_data["keyValue"]:
        merged_data.update(d) 
    
    data = map_categorical_values(merged_data)

    print(data)

    if not request_data:
        return jsonify({'error': 'No data provided'}), 400

    # Preprocess the data
    try:
        processed_data = preprocess_input(data)
        

    except Exception as e:
        print()
        return jsonify({'error': f'Preprocessing failed: {str(e)}'}), 400

    # Make a prediction
    try:
        prediction = model.predict(processed_data)
        return round(prediction.tolist()*100 , 2)
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
    
