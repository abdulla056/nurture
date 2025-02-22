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
        counter_ref = db.collection("counter").document("patient_id")
        count = counter_ref.get()
        if not count.exists:
            raise Exception("Counter does not exist")
        next_id = count.to_dict()["nextId"]
        patientId = f"P{next_id:03}" # Format with leading zeros
        counter_ref.update({"nextId":int(next_id+1)})
        patient_ref = db.collection('patients').document(patientId)
        patient_ref.set({
            'patientId': patientId,
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
        patients_ref = db.collection('patients').where("doctorId", "==", DoctorID).stream()
        patients = [doc.to_dict() for doc in patients_ref]
        
        if patients:
            return jsonify(patients), 200
        else:
            return jsonify({"message": "No patients found for this doctor"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400