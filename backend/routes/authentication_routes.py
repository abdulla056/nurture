from firebase_admin import credentials, auth, firestore # type: ignore
import firebase_admin.exceptions as firebase_exceptions #type: ignore
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
    workplace = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

schema = SignUpSchema()

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        try:
            user = auth.get_user_by_email(email)  # Get user from Firebase

            # Verify password (compare with stored hash)
            stored_hash = user.password.encode('utf-8')
            if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                return jsonify({'error': 'Invalid email or password'}), 401

            # JWT generation (same as phone auth):
            payload = {
                'uid': user.uid,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=1),
            }
            token = jwt.encode(payload, 'your_secret_key', algorithm='HS256')

            return jsonify({'token': token}), 200

        except auth.UserNotFoundError:
            return jsonify({'error': 'Invalid email or password'}), 401
        except auth.AuthError as e:
            return jsonify({'error': str(e)}), 401 # Other Firebase Auth errors

    except Exception as e:
        return jsonify({'error': str(e)}), 500

## Not tested
@auth_bp.route('/verify_phone', methods=['POST'])
def verify_phone():
    try:
        data = request.get_json()
        verification_id = data.get('verificationId')
        verification_code = data.get('verificationCode')

        credential = auth.PhoneAuthProvider.credential(verification_id, verification_code)
        user = auth.verify_credential(credential)  # Verify on the server!
        
        payload = {
            'uid': user.uid,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
        }

        token = jwt.encode(payload, secret_key, algorithm='HS256') 

        return jsonify({'token': token}), 201  # Send back user ID or a JWT

    except firebase_exceptions.OutOfRangeError as e:
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

        counter_ref = db.collection("counter").document("doctor_id")
        count = counter_ref.get()
        if not count.exists:
            raise Exception("Counter does not exist")
        next_id = count.to_dict()["nextId"]
        doctor_id = f"D{next_id:03}" # Format with leading zeros
        counter_ref.update({"nextId":int(next_id+1)})                         
        try:
            user = auth.create_user(
                email=email,
                email_verified=False,
                password=hashed_password.decode('utf-8'),
                display_name=data["firstName"] + " " + data["lastName"] # Set user's name
            )
            print(data)
            print("Password received and processed.")
        except firebase_exceptions.OutOfRangeError as e:
            return jsonify({'error': str(e)}), 400
        try:
            print("Adding doctor")
            data = request.json
            doctor_ref = db.collection('doctors').document(doctor_id)
            doctor_ref.set({
                'doctorId' : doctor_id,
                'firstName': data['firstName'],
                'lastName': data['lastName'],
                'email': email,
                'licenseNumber': data['doctorLicense'],
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

    except firebase_exceptions.OutOfRangeError as e:
        return jsonify({'error': str(e)}), 400  # Handle Firebase Auth errors

@auth_bp.route('/check_header', methods=['GET'])
def protected_resource():
    try:
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        token = auth_header.split(' ')[1]  # Extract the token (remove "Bearer ")
        # Verify the token
        try:
            payload = jwt.decode(token, secret_key, algorithms=['HS256']) # Use the same secret
            user_id = payload['uid'] # Access the uid from the payload
            return jsonify({'message': 'Protected resource accessed', 'user_id': user_id}), 200

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth_bp.route('/send_password_reset_email', methods=['POST'])
def send_password_reset_email():
    try:
        data = request.get_json()  # Get the email from the request
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        auth.send_password_reset_email(email)

        return jsonify({'message': 'Password reset email sent'}), 200

    except Exception as e:
        print(f"Error sending password reset email: {e}") # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message