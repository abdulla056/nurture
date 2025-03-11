from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
patient_bp = Blueprint('patient_bp', __name__)

## Functionality for adding a new patient
@patient_bp.route('/add', methods=['POST'])
def add_patient():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            patient_ref = db.collection('patients').document(data['patientId'])
            patient_ref.set({
                'patientId': data['patientId'],
                'doctorId': response['user_id'],
            })
            return jsonify({"message": "Patient added successfully"}), 201
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Get the patients that are being managed by the doctor
@patient_bp.route('/get_all', methods=['GET'])
def get_patients():
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            patients_ref = db.collection('patients').where("doctorId", "==", response['user_id']).stream()
            patients = [doc.to_dict() for doc in patients_ref]
            
            if patients:
                return jsonify(patients), 200
            else:
                return jsonify({"message": "No patients found for this doctor"}), 404
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400