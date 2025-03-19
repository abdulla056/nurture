from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route
from auth.rate_limiter import rate_limit
import logging

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
patient_bp = Blueprint('patient_bp', __name__)

patient_logger = logging.getLogger('patient_logger')

## Functionality for adding a new patient
@patient_bp.route('/add', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def add_patient():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            patient_ref = db.collection('patients').document(data['patientId'])
            if patient_ref.get().exists:
                patient_logger.warning(f"Patient already exists by DoctorID: {response['user_id']} with PatientID: {data['patientId']}, IP: {request.remote_addr}")
                return jsonify({"message": "Patient already exists"}), 409
            else:
                patient_ref.set({
                    'patientId': data['patientId'],
                    'birthDate': data['birthDate'],
                    'pregnancyDate': data['pregnancyDate'],
                    'doctorId': response['user_id'],
                })
                patient_logger.info(f"Patient added by DoctorID: {response['user_id']} with PatientID: {data['patientId']}, IP: {request.remote_addr}")
                return jsonify({"message": "Patient added successfully"}), 201
        else:
            patient_logger.warning(f"Unauthorized attempt to add patient by IP: {request.remote_addr}")
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        patient_logger.error(f"Error adding patient: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 400


## Get the patients that are being managed by the doctor
@patient_bp.route('/get_all', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_patients():
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            patients_ref = db.collection('patients').where("doctorId", "==", response['user_id']).stream()
            patients = [doc.to_dict() for doc in patients_ref]
            if patients:
                patient_logger.info(f"Patients retrieved by DoctorID: {response['user_id']}, IP: {request.remote_addr}")
                return jsonify(patients), 200
            else:
                patient_logger.warning(f"No patients found for DoctorID: {response['user_id']}, IP: {request.remote_addr}")
                return jsonify({"message": "No patients found for this doctor"}), 404
        else:
            patient_logger.warning(f"Unauthorized attempt to get all patients by IP: {request.remote_addr}")
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        patient_logger.error(f"Error getting all patients: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 400
    
@patient_bp.route('/delete', methods=['DELETE'])
@rate_limit(max_requests=10, window_size=60) 
def delete_patient():
    try:
        response = protected_route(request, 'delete')
        if response['valid']:
            data = request.json
            patient_ref = db.collection('patients').document(data['patientId'])
            if not patient_ref.get().exists:
                patient_logger.warning(f"Patient not found by DoctorID: {response['user_id']} with PatientID: {data['patientId']}, IP: {request.remote_addr}")
                return jsonify({"message": "Patient not found"}), 404
            if patient_ref.get().to_dict()['doctorId'] == response['user_id']:
                patient_ref.delete()
                patient_logger.info(f"Patient deleted by DoctorID: {response['user_id']} with PatientID: {data['patientId']}, IP: {request.remote_addr}")
                return jsonify({"message": "Patient deleted successfully"}), 200
            else:    
                patient_logger.warning(f"Unauthorized attempt to delete patient by Doctor {response['user_id']},IP: {request.remote_addr}")
                return jsonify({"message": "Unauthorized"}), 401
        else:
            patient_logger.warning(f"Unauthorized attempt to delete patient by IP: {request.remote_addr}")
            return jsonify({"message": "Unauthorized"}), 402
    except Exception as e:
        patient_logger.error(f"Error deleting patient: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 400
    
