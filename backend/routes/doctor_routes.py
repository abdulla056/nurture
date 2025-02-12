from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
doctor_bp = Blueprint('doctor_bp', __name__)

## Functionality to add a new doctor
@doctor_bp.route('/add', methods=['POST'])
def add_doctor():
    try:
        print("Adding doctor")
        data = request.json
        doctor_ref = db.collection('doctors').document(data['doctorId'])
        doctor_ref.set({
            'doctorId' : data['doctorId'],
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'licenseNumber': data['licenseNumber'],
            'workplace': data['workplace']
        })
        return jsonify({"message": "Doctor added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
## Get Doctor by ID
@doctor_bp.route('/get/<DoctorID>', methods=['GET'])
def get_doctor(DoctorID):
    try:
        doctor_ref = db.collection('doctors').document(DoctorID)
        doctor = doctor_ref.get()
        
        if doctor.exists:
            return jsonify(doctor.to_dict()), 200
        else:
            return jsonify({"error": "Doctor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    