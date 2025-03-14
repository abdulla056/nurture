from datetime import datetime
from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route
from auth.firebase import get_next_id
from auth.rate_limiter import rate_limit

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
details_bp = Blueprint('details_bp', __name__)

## Adding patient details    
@details_bp.route('/add_details', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def add_patient_details():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            detailId = get_next_id('detail')

            details_ref = db.collection('details').document(detailId)
            details_ref.set({
                'detailId': detailId,
                'patientId': data['patientId'],
                'doctorId': response['user_id'],
                'timestamp': datetime.utcnow(),

                # Store lifestyle factors as a map
                'lifestyleFactors': {
                    'WICStatus': data.get('WICStatus'),
                    'cigarettesSecondTrimester': data.get('cigarettesSecondTrimester'),
                    'tobaccoUse': data.get('tobaccoUse'),
                    'cigarettesBeforePregnancy': data.get('cigarettesBeforePregnancy'),
                    'cigarettesFirstTrimester': data.get('cigarettesFirstTrimester'),
                    'cigarettesThirdTrimester': data.get('cigarettesThirdTrimester'),
                    'monthPrenatalCareBegan': data.get('monthPrenatalCareBegan')
                },

                # Store risk data as a map
                'riskData': {
                    'prePregnancyDiabetes': data.get('prePregnancyDiabetes'),
                    'gestationalHypertension': data.get('gestationalHypertension'),
                    'infertilityTreatment': data.get('infertilityTreatment'),
                    'asstReproductiveTechnology': data.get('asstReproductiveTechnology'),
                    'rupturedUterus': data.get('rupturedUterus'),
                    'wasAutopsyPerformed': data.get('wasAutopsyPerformed'),
                    'gestationalDiabetes': data.get('gestationalDiabetes'),
                    'prePregnancyHypertension': data.get('prePregnancyHypertension'),
                    'hypertensionEclampsia': data.get('hypertensionEclampsia'),
                    'fertilityEnhancingDrugs': data.get('fertilityEnhancingDrugs'),
                    'previousCesareans': data.get('previousCesareans'),
                    'admitToIntensiveCare': data.get('admitToIntensiveCare'),
                    'wasHistologicalPlacentalExamPerformed': data.get('wasHistologicalPlacentalExamPerformed')
                },

                # Store demographic data as a map
                'demographicData': {
                    'deliveryYear': data.get('deliveryYear'),
                    'deliveryMonth': data.get('deliveryMonth'),
                    'deliveryWeekday': data.get('deliveryWeekday'),
                    'mothersSingleYearOfAge': data.get('mothersSingleYearOfAge'),
                    'mothersAgeRecode14': data.get('mothersAgeRecode14'),
                    'mothersRaceRecode31': data.get('mothersRaceRecode31'),
                    'mothersEducationRevised': data.get('mothersEducationRevised'),
                    'mothersHeightInches': data.get('mothersHeightInches'),
                    'prepregnancyWeightRecode': data.get('prepregnancyWeightRecode'),
                    'birthWeightDetailsGrams': data.get('birthWeightDetailsGrams'),
                    'fathersCombinedAge': data.get('fathersCombinedAge')
                }
            })

            return jsonify({"message": "Patient details added successfully", "detailId": detailId}), 200
        else:
            return jsonify({"message": "Unauthorized"}), 401
        

    except Exception as e:
        return jsonify({"error": str(e)}), 500


## Fetch patient details by detailID
@details_bp.route('/get_details/<DetailID>', methods=['GET'])
@rate_limit(max_requests=20, window_size=60) 
def get_patient_details(DetailID):
    response = protected_route(request, 'get')
    if response['valid']:
        details_ref = db.collection('details').document(DetailID)
        details = details_ref.get()

        if details.exists:
            return jsonify(details.to_dict()), 200
        else:
            return jsonify({"error": "Details not found"}), 404    
    else:
        return jsonify({"message": "Unauthorized"}), 401
    
## Add prediction for patient
@details_bp.route('/add_prediction', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def add_prediction():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            
            contributing_factors_map = {
                factor: details['percentage'] for factor, details in data['contributingFactors'].items()
            }

            prediction_ref = db.collection('predictions').document(data['predictionId'])
            prediction_ref.set({
                'predictionId': data['predictionId'],
                'patientId': data['patientId'],
                'doctorId': data['doctorId'],
                'detailId' : data['detailId'],
                'predictionResult': data['predictionResult'],
                'confidenceScore': data['confidenceScore'],
                'timestamp': datetime.utcnow(),
                'riskLevel': data['riskLevel'],
                'riskScore': data['riskScore'],
                'expectedOutcome': data['expectedOutcome'],
                'contributingFactors': contributing_factors_map            
            })
            return jsonify({"message": "Prediction added successfully"}), 200
        else:
            return jsonify({"message": "Unauthorized"}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

## Fetch prediction by predictionID
@details_bp.route('/get_prediction/<PredictionID>', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_prediction(PredictionID):
    response = protected_route(request, 'get')
    if response['valid']:
        prediction_ref = db.collection('predictions').document(PredictionID)
        prediction = prediction_ref.get()

        if prediction.exists:
            return jsonify(prediction.to_dict()), 200
        else:
            return jsonify({"error": "Prediction not found"}), 404
    else:
        return jsonify({"message": "Unauthorized"}), 401


## Fetch all predictions for a certain patient
@details_bp.route('/get_predictions/<PatientID>', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_predictions(PatientID):
    response = protected_route(request, 'get')
    if response['valid']:
        predictions_ref = db.collection('predictions').where("patientId", "==", PatientID).stream()
        predictions = [doc.to_dict() for doc in predictions_ref]

        if predictions:
            return jsonify(predictions), 200
        else:
            return jsonify({"message": "No predictions found for this patient"}), 404
    else:
        return jsonify({"message": "Unauthorized"}), 401

@details_bp.route('/get_all_predictions', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_all_predictions():
    response = protected_route(request, 'get')
    if response['valid']:
        predictions_ref = db.collection('predictions').stream()
        predictions = [doc.to_dict() for doc in predictions_ref]

        if predictions:
            return jsonify(predictions), 200
        else:
            return jsonify({"message": "No predictions found"}), 404
    else:
        return jsonify({"message": "Unauthorized"}), 401

@details_bp.route('/delete_prediction', methods=['DELETE'])
@rate_limit(max_requests=10, window_size=60) 
def delete_prediction():
    try:
        response = protected_route(request, 'delete')
        if response['valid']:
            data = request.json
            prediction_ref = db.collection('predictions').document(data['predictionId'])
            if not prediction_ref.get().exists:
                return jsonify({"message": "Prediction not found"}), 404
            if prediction_ref.get().to_dict()['doctorId'] == response['user_id']:
                prediction_ref.delete()
                return jsonify({"message": "Prediction deleted successfully"}), 200
            else:
                return jsonify({"message": "Unauthorized"}), 401
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@details_bp.route('/delete_details', methods=['DELETE'])
@rate_limit(max_requests=10, window_size=60) 
def delete_details():
    try:
        response = protected_route(request, 'delete')
        if response['valid']:
            data = request.json
            detail_ref = db.collection('details').document(data['detailId'])
            if not detail_ref.get().exists:
                return jsonify({"message": "Prediction not found"}), 404
            if detail_ref.get().to_dict()['doctorId'] == response['user_id']:
                prediction_ref = db.collection('predictions').where("detailId", "==", data['detailId']).stream()
                for doc in prediction_ref:
                    doc.reference.delete()
                detail_ref.delete()
                return jsonify({"message": "Detail deleted successfully"}), 200
            else:
                return jsonify({"message": "Unauthorized"}), 401
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400
