from firebase_admin import credentials, auth, firestore # type: ignore
import firebase_admin.exceptions as firebase_exceptions #type: ignore
from flask import request, jsonify, Blueprint
from config import Config
from marshmallow import Schema, fields, validate, ValidationError
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
    firstName = fields.Str(
        required=True,
        validate=[
            validate.Length(min=2, error="First name must be at least 2 characters"),
            validate.Regexp(r"^[A-Za-z\s]+$", error="Only letters and spaces are allowed")
        ]
    )
    lastName = fields.Str(
        required=True,
        validate=[
            validate.Length(min=2, error="Last name must be at least 2 characters"),
            validate.Regexp(r"^[A-Za-z\s]+$", error="Only letters and spaces are allowed")
        ]
    )
    emailAddress = fields.Email(
        required=True,
        error="Invalid email format"
    )
    doctorLicense = fields.Str(
        required=True,
        validate=[
            validate.Length(min=2, error="Doctor license must be at least 2 characters"),
            validate.Regexp(r"^[A-Za-z0-9\s]+$", error="Only letters, numbers, and spaces are allowed")
        ]
    )
    password = fields.Str(
        required=True,
        validate=[
            validate.Length(min=6, error="Password must be at least 6 characters"),
            validate.Regexp(
                r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$",
                error="Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
        ]
    )
    phoneNumber = fields.Str(
        required=True,
        validate=[
            validate.Regexp(r"^\+[0-9]+$", error="Invalid phone number format (numbers only) (must have a `+` in the front)"),
            validate.Length(min=7, max=15, error="Phone number must be between 7 and 15 digits")
        ]
    )
    workplace = fields.Str(
        required=True,
        validate=[
            validate.Length(min=2, error="Workplace must be at least 2 characters"),
            validate.Regexp(r"^[A-Za-z\s]+$", error="Workplace must contain only letters and spaces (no special characters)")
        ]
    )

class LoginSchema(Schema):
    emailAddress = fields.Email(
        required=True,
        error="Invalid email format"
    )
    password = fields.Str(
        required=True,
        validate=[
            validate.Length(min=6, error="Password must be at least 6 characters"),
            validate.Regexp(
                r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$",
                error="Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
        ]
    )

signupSchema = SignUpSchema()

loginSchema = LoginSchema()

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        validated_data = loginSchema.load(data)
        email = validated_data['emailAddress']
        password = validated_data['password']

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
    except ValidationError as e:
        print(e.messages)
        return jsonify({'Validation Error': e.messages}), 400
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
        validated_data = signupSchema.load(data)
        firstName = validated_data['firstName']
        lastName = validated_data['lastName']
        email = validated_data['emailAddress']
        phoneNumber = validated_data['phoneNumber']
        license = validated_data['doctorLicense']
        workplace = validated_data['workplace']
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
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'phoneNumber': phoneNumber,
                'licenseNumber': license,
                'workplace': workplace
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