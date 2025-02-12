from datetime import datetime
from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
prediction_bp = Blueprint('prediction_bp', __name__)

## Adding patient details    
@prediction_bp.route('/add_details', methods=['POST'])
def add_patient_details():
    try:
        data = request.json
        details_ref = db.collection('details').document(data['detailId'])
        details_ref.set({
            'patientId': data['patientId'],
            'timestamp': datetime.utcnow(),
            'deliveryMonth': data['deliveryMonth'],
            'deliveryYear': data['deliveryYear'],
            'prepregnancyDiabetes': data['prepregnancyDiabetes'],
            'gestationalDiabetes': data['gestationalDiabetes'],
            'mothersRaceRecode31': data['mothersRaceRecode31'],
            'mothersAge1': data['mothersAge1'],
            'sexOfInfant': data['sexOfInfant'],
            'pluralityRecode': data['pluralityRecode'],
            'cigarettesBeforePregnancy': data['cigarettesBeforePregnancy'],
            'WICStatus': data['WICStatus'],
        })
        return jsonify({"message": "Patient details added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

## Add prediction for patient
@prediction_bp.route('/add_prediction', methods=['POST'])
def add_prediction():
    try:
        data = request.json
        prediction_ref = db.collection('predictions').document(data['predictionId'])
        prediction_ref.set({
            'patientId': data['patientId'],
            'doctorId': data['doctorId'],
            'detailId' : data['detailId'],
            'predictionResult': data['predictionResult'],
            'confidenceScore': data['confidenceScore'],
            'timestamp': datetime.utcnow()
        })

        contributing_factors_ref = prediction_ref.collection('contributingFactors')
        for factor, details in data['contributingFactors'].items():
            contributing_factors_ref.document(factor).set({
                'factor': factor,
                'description': details['desc'],
                'contributionPercentage': details['percentage']
        })
        
        return jsonify({"message": "Prediction added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

## Fetch prediction by predictionID
@prediction_bp.route('/get_prediction/<PredictionID>', methods=['GET'])
def get_prediction(PredictionID):
    prediction_ref = db.collection('predictions').document(PredictionID)
    prediction = prediction_ref.get()

    if prediction.exists:
        return jsonify(prediction.to_dict()), 200
    else:
        return jsonify({"error": "Prediction not found"}), 404

## Fetch all predictions for a certain patient
@prediction_bp.route('/get_all_predictions/<PatientID>', methods=['GET'])
def get_predictions(PatientID):
    predictions_ref = db.collection('predictions').where("patientId", "==", PatientID).stream()
    predictions = [doc.to_dict() for doc in predictions_ref]

    if predictions:
        return jsonify(predictions), 200
    else:
        return jsonify({"message": "No predictions found for this patient"}), 404