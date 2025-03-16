from flask import request, Blueprint, jsonify
import numpy as np
import pandas as pd
from tensorflow import keras 
import joblib
import os
import logging

dl_logger = logging.getLogger('dl_logger')

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


def preprocess_input(data):
    # Convert input data to a DataFrame
    df = pd.DataFrame([data])
    print(df)

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
    
@dl_bp.route('/predict', methods=['POST'])
def predict():
    try:
         response = protected_route(request, 'post')
        if response['valid']:
            # Get data from the frontend
            request_data = request.json
            if not request_data:
                dl.logger.warning(f"No data was provided by Doctor {response['user_id']}, IP: {request.remote_addr}")
                return jsonify({'error': 'No data provided'}), 400
            # Preprocess the data
            try:
                processed_data = preprocess_input(request_data)
            except Exception as e:
                dl_logger.error(f'Preprocessing failed: {str(e)}, IP: {request.remote_addr}')
                return jsonify({'error': 'Preprocessing failed'}), 400
        
            # Make a prediction
            try:
                prediction = model.predict(processed_data)
                return jsonify({'prediction': prediction.tolist()})
            except Exception as e:
                dl_logger.error(f'Prediction failed: {str(e)}, IP: {request.remote_addr}')
                return jsonify({'error': 'Prediction failed'}), 500
        else:
            dl_logger.warning(f"Unauthorized attempt to make prediction by IP: {request.remote_addr}")
            return jsonify({"error": "Unauthorized"}), 401
    except Exception as e:
        dl_logger.error(f"Error predicting: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 500
            
