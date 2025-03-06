from firebase_admin import credentials, auth, firestore # type: ignore
import firebase_admin.exceptions as firebase_exceptions #type: ignore
from flask import request, jsonify, Blueprint, make_response, session
from flask_session import Session
from config import Config
from marshmallow import Schema, fields, validate, ValidationError
import bcrypt
import jwt
from datetime import datetime, timedelta
from google.cloud.firestore_v1.base_query import FieldFilter
from auth.email import sendMessage
from auth.firebase import verify_firebase_token
from random import randint
from auth.session_data import get_session_by_sid, update_session

secret_key = Config.SECRET_KEY
temp_key = Config.TEMP_KEY
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
auth_bp = Blueprint('auth_bp', __name__)

# Marshmallow schema for signing up
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

# Marshmallow schema for logging in
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

# Loading the schemas
signupSchema = SignUpSchema()
loginSchema = LoginSchema()

# Login Route to verify token sent in from Firebase, generates a temporary 5 minute token.
@auth_bp.route('/verify_token', methods=['POST'])
def verify_token():
    try:
        data = request.get_json()
        id_token = data.get('token')
        email = data.get('email')
        if not id_token:
            return jsonify({'error': 'Token is required'}), 400

        decoded_token = verify_firebase_token(id_token) #auth.verify_id_token(id_token)
        print("decoded")
        email = decoded_token['email']
        session.clear()
        session['email'] = email
        print(session.sid)
        return jsonify({
            'message' : 'MFA required',
            'session_id' : session.sid
        }), 200
    
    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        return jsonify({'error': 'An internal error occurred. Please try again later.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Sends verification code to the user's phone number
@auth_bp.route('/send_email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        session_id = data['sessionId']
        session_data = get_session_by_sid(session_id)
        email = session_data['email']
        session_data['mfa'] = randint(100000, 999999)
        doctor_ref = db.collection('doctors').where(filter=FieldFilter("email", "==", email))
        doctor = doctor_ref.get()
        name = doctor[0].to_dict()['firstName'] + " " + doctor[0].to_dict()['lastName'] 
        sendMessage(email, name, session_data['mfa'])
        update_session(session_id, session_data)
        return jsonify({'message' : "MFA code has been sent out", "session_id" : session_id})
    except Exception as e:
        print(f"Error getting number: {e}")  # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message    

## Not tested
@auth_bp.route('/verify_otp', methods=['POST'])
def verify_otp():
    print('verify_otp')
    try:
        data = request.get_json()
        session_id = data['sessionId']
        code = data['code']
        session_data = get_session_by_sid(session_id)
        email = session_data['email']
        doctor_ref = db.collection('doctors').where(filter=FieldFilter("email", "==", email))
        doctor = doctor_ref.get()
        uid = doctor[0].to_dict()['doctorId']
        email = doctor[0].to_dict()['email']
        print("Code is ",code)
        print("MFA is ", session_data['mfa'])
        if not uid:
            return jsonify({'error': 'Doctor not found'}), 404

        if int(code) == int(session_data['mfa']):
            payload = {
            'uid': uid,
            'email': email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
            }
            token = jwt.encode(payload, secret_key, algorithm='HS256') 
            return jsonify({'token':token}), 200  # Send back JWT
        
        elif code != session_data['mfa'] :
            return jsonify({'error': 'Verification code is incorrect'}), 303
        
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid or expired temporary token'}), 401  # Token has expired
    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return jsonify({'error': str(e)}), 500  # Handle other errors

## Registration 
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        validated_data = signupSchema.load(data)
        first_name = validated_data['firstName']
        last_name = validated_data['lastName']
        email = validated_data['emailAddress']
        phone_number = validated_data['phoneNumber']
        password = validated_data['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        license = validated_data['doctorLicense']
        workplace = validated_data['workplace']
        try:
            user = auth.create_user(
                email=email,
                email_verified=False,
                password=hashed_password.decode('utf-8'),
                display_name=data["firstName"] + " " + data["lastName"] # Set user's name
            )
            print(data)
            print("Password received and processed.")
        except firebase_exceptions.UnauthenticatedError as e:
            return jsonify({'error': str(e)}), 400
        
        counter_ref = db.collection("counter").document("doctor_id")
        count = counter_ref.get()
        if not count.exists:
            raise Exception("Counter does not exist")
        next_id = count.to_dict()["nextId"]
        doctor_id = f"D{next_id:03}" # Format with leading zeros
        counter_ref.update({"nextId":int(next_id+1)})                         
        
        try:
            print("Adding doctor")
            data = request.json
            doctor_ref = db.collection('doctors').document(doctor_id)
            doctor_ref.set({
                'doctorId' : doctor_id,
                'firstName': first_name,
                'lastName': last_name,
                'email': email,
                'phoneNumber': phone_number,
                'licenseNumber': license,
                'workplace': workplace
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
        payload = {
            'uid': doctor_id,
            'email' : email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
        }

        token = jwt.encode(payload, secret_key, algorithm='HS256') 

        # Create a response object
        response = make_response(jsonify({"message": "Login successful"}), 201)

        # Set the JWT as a cookie with SameSite attribute
        response.set_cookie(
            "token",  # Cookie name
            value=token,  # JWT as the cookie value
            httponly=True,  # Prevent client-side JavaScript from accessing the cookie
            secure=True,  # Only send the cookie over HTTPS
            samesite="Lax",  # Prevent CSRF attacks
            max_age=3600,  # Cookie expiration time in seconds (1 hour)
        )

        return response, 201  # Send back cookie

    except firebase_exceptions.OutOfRangeError as e:
        return jsonify({'error': str(e)}), 400  # Handle Firebase Auth errors

@auth_bp.route('/check_token', methods=['GET'])
def check_cookie():
    try:
        data = request.get_json()
        token = data['token']

        if not token:
            return jsonify({'error': 'Token missing'}), 403
        
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