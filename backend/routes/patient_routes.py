from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
patient_bp = Blueprint('patient_bp', __name__)

## Functionality for adding a new patient
@patient_bp.route('/add', methods=['POST'])
def add_patient():
    try:
        data = request.json
        patient_ref = db.collection('patients').document(data['patientId'])
        patient_ref.set({
            'doctorId': data['doctorId'],
            'detailId': data['detailId']
        })
        return jsonify({"message": "Patient added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Get the patients that are being managed by the doctor
@patient_bp.route('/get_all/<DoctorID>', methods=['GET'])
def get_patients(DoctorID):
    try:
        patients_ref = db.collection('patients').where(filter = ("doctorId", "==", DoctorID)).stream()
        patients = [doc.to_dict() for doc in patients_ref]
        
        if patients:
            return jsonify(patients), 200
        else:
            return jsonify({"message": "No patients found for this doctor"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400