import firebase_admin
from firebase_admin import credentials, auth, firestore # type: ignore
from flask import request, jsonify, Blueprint
from config import Config
from marshmallow import Schema, fields, validate
import bcrypt
import jwt
from datetime import datetime, timedelta

secret_key = Config.SECRET_KEY
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
auth_bp = Blueprint('auth_bp', __name__)

# Marshmallow schema for validation
class SignUpSchema(Schema):
    firstName = fields.Str(required=True, validate=validate.Length(min=2))
    lastName = fields.Str(required=True, validate=validate.Length(min=2))
    emailAddress = fields.Email(required=True)
    doctorLicense = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

schema = SignUpSchema()



## Not tested
@auth_bp.route('/verify_phone', methods=['POST'])
def verify_phone():
    try:
        data = request.get_json()
        verification_id = data.get('verificationId')
        verification_code = data.get('verificationCode')

        credential = auth.PhoneAuthProvider.credential(verification_id, verification_code)
        user = auth.verify_credential(credential)  # Verify on the server!
        
        # User is authenticated! Do what you need (e.g., create a session, issue a JWT)
        return jsonify({'uid': user.uid}), 200 # Send back user ID or a JWT

    except auth.AuthError as e:
        return jsonify({'error': str(e)}), 400  # Handle Firebase Auth errors
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Handle other errors

## Registration 
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        validated_data = schema.load(data)
        email = validated_data['emailAddress']
        password = validated_data['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        try:
            user = auth.create_user(
                email=email,
                email_verified=False,
                password=hashed_password.decode('utf-8'),
                display_name=data["firstName"] + " " + data["lastName"] # Set user's name
            )
        except auth.AuthError as firebase_error:
            return jsonify({'error': str(firebase_error)}), 400
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
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
        payload = {
            'uid': user.uid,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
        }

        token = jwt.encode(payload, secret_key, algorithm='HS256') 

        return jsonify({'token': token}), 201  # Send back user ID or a JWT

    except auth.AuthError as e:
        return jsonify({'error': str(e)}), 400  # Handle Firebase Auth errors