from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route
from auth.rate_limiter import rate_limit

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
doctor_bp = Blueprint('doctor_bp', __name__)

## Functionality to add a new doctor
@doctor_bp.route('/add', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def add_doctor():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
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
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
## Get Doctor by ID
@doctor_bp.route('/get', methods=['GET'])
@rate_limit(max_requests=10, window_size=60)
def get_doctor():
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            doctor_ref = db.collection('doctors').document(request['user_id'])
            doctor = doctor_ref.get()
            
            if doctor.exists:
                return jsonify(doctor.to_dict()), 200
            else:
                return jsonify({"error": "Doctor not found"}), 404
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    