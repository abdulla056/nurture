from firebase_admin import credentials, auth, firestore # type: ignore
import firebase_admin.exceptions as firebase_exceptions #type: ignore
from flask import request, jsonify, Blueprint, make_response, session
from config import Config
from marshmallow import Schema, fields, validate
import bcrypt
import jwt
from datetime import datetime, timedelta
from google.cloud.firestore_v1.base_query import FieldFilter
from auth.email import sendMessage
from auth.firebase import verify_firebase_token
from random import randint
from auth.session_data import CustomRedisSessionInterface
import redis
import os

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

# Initialize the custom session interface
redis_client = redis.from_url("redis://localhost:6341")  # Replace with your Redis URL
custom_session_interface_login = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix="login_session:",  # Unique prefix for session keys
    ttl=300  # Default TTL of 300 seconds
)

custom_session_interface_csrf = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix="csrf_token:",  # Unique prefix for CSRF tokens
    ttl= 3600 # Default TTL of 1 hour
)

def protected_route(request, state):
    try:
        print("Protected route")
        print(request.cookies)
        authToken = request.cookies.get('authToken')
        csrf_token = request.headers.get('X-CSRF-Token')
        print(csrf_token)
        custom_session_interface_csrf.get_session_by_csrf_token(csrf_token)
        if authToken and state == 'get':
            # Verify the token
            try:
                payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
                user_id = payload['uid'] # Access the uid from the payload
                return {'message': 'Protected resource accessed', 'user_id': user_id,'valid':True}
            except jwt.ExpiredSignatureError:
                return {'error': 'Token expired','valid':False}
            except jwt.InvalidTokenError:
                return {'error': 'Invalid token','valid':False}
        elif authToken and csrf_token and (state == 'post' or state == 'put' or  state == 'delete'):
            # Verify the token
            try:
                payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
                user_id = payload['uid'] # Access the uid from the payload
                return {'message': 'Protected resource accessed', 'user_id': user_id,'valid':True}
            except jwt.ExpiredSignatureError:
                return {'error': 'Token expired','valid':False}
            except jwt.InvalidTokenError:
                return {'error': 'Invalid token','valid':False}
        else:
            return {'error': 'Unauthorized','valid':False}
    except Exception as e:
        return jsonify({'error': str(e)}), 303

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
        redirect = 'login'
        session_id = custom_session_interface_login.create_session(email, redirect)
        if session_id:
            print(session_id)
            return jsonify({
                'message' : 'MFA required',
                'session_id' : session_id
            }), 200
        else:
            return jsonify({'error': 'Failed to create session'}), 402
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
        session_data = custom_session_interface_login.get_session_by_sid(session_id)
        if session_data and session_data['redirect'] == 'login':
            email = session_data['email']
            mfa = randint(100000, 999999)
            session_data['mfa'] = mfa
            doctor_ref = db.collection('doctors').where(filter=FieldFilter("email", "==", email))
            doctor = doctor_ref.get()
            name = doctor[0].to_dict()['firstName'] + " " + doctor[0].to_dict()['lastName'] 
            sendMessage(email, name, mfa)
            custom_session_interface_login.update_session(session_id, session_data)
            return jsonify({'message' : "MFA code has been sent out", "session_id" : session_id}), 200
        elif session_data and session_data['redirect'] == 'register':
            session_data['mfa'] = randint(100000, 999999)
            name = session_data['first_name'] + " " + session_data['last_name']
            sendMessage(session_data['email'], name, session_data['mfa'])
            custom_session_interface_login.update_session(session_id, session_data)
            return jsonify({'message' : "MFA code has been sent out", "session_id" : session_id}), 200
        else:
            return jsonify({'error': "Session expired, please reload and try again."}), 401
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
        session_data = custom_session_interface_login.get_session_by_sid(session_id)
        if session_data and session_data['redirect'] == 'login':
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
                custom_session_interface_login.delete_session_by_sid(session_id) 
                csrf_token = os.urandom(16).hex()
                custom_session_interface_csrf.create_session(csrf_token)
                response = make_response(jsonify({"message": "Login successful", "csrf_token": csrf_token}), 200)
                # Set a cookie with a session ID or token
                response.set_cookie(
                    "authToken",  # Cookie name
                    value=token,  # Cookie value
                    httponly=True,  # Prevent client-side access
                    secure=True,  # Only send over HTTPS
                    samesite="None",  # Prevent CSRF
                    max_age=3600,  # Expires in 1 hour
                    path="/",  # Accessible across the entire site
                )
                return response
            elif code != session_data['mfa'] :
                return jsonify({'error': 'Verification code is incorrect'}), 303
        elif session_data and session_data['redirect'] == 'register':
            # Check if the verification code matches
            if int(code) == int(session_data['mfa']):
                try:
                    email = session_data['email']
                    user = auth.create_user(
                        email=email,
                        email_verified=False,
                        password=session_data['password'],
                        display_name=session_data["first_name"] + " " + session_data["last_name"] # Set user's name
                    )
                    print(data)
                    print("Password received and processed.")
                except Exception as e:
                    print(e)
                    return jsonify({'error': str(e)}), 501
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
                        'firstName': session_data['first_name'],
                        'lastName': session_data['last_name'],
                        'email': session_data['email'],
                        'phoneNumber': session_data['phone_number'],
                        'licenseNumber': session_data['license'],
                        'workplace': session_data['workplace']
                    })
                except Exception as e:
                    return jsonify({"error": str(e)}), 500
                
                payload = {
                    'uid': doctor_id,
                    'email' : email,
                    'iat': datetime.utcnow(),
                    'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
                }

                csrf_token = os.urandom(16).hex()
                custom_session_interface_csrf.create_session(csrf_token)
                response = make_response(jsonify({"message": "Login successful", "csrf_token": csrf_token}), 200)
                # Set a cookie with a session ID or token
                response.set_cookie(
                    "authToken",  # Cookie name
                    value=token,  # Cookie value
                    httponly=True,  # Prevent client-side access
                    secure=True,  # Only send over HTTPS
                    samesite="None",  # Prevent CSRF
                    max_age=3600,  # Expires in 1 hour
                    path="/",  # Accessible across the entire site
                )
                return response
            else:
                return jsonify({'error': 'Invalid verification code'}), 400
        else:
            return jsonify({'error': "Session expired, please reload and try again."}), 401
        
        
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
        email = validated_data['emailAddress']
        redirect = 'register'
        session_id = custom_session_interface_login.create_session(email,redirect)
        session_data = custom_session_interface_login.get_session_by_sid(session_id)
        session_data['first_name'] = validated_data['firstName']
        session_data['last_name'] = validated_data['lastName']
        session_data['phone_number'] = validated_data['phoneNumber']
        session_data['password'] = validated_data['password']
        session_data['license'] = validated_data['doctorLicense']
        session_data['workplace'] = validated_data['workplace']
        print("Here")      
        custom_session_interface_login.update_session(session_id, session_data)
        return jsonify({'message': 'Registration MFA required', 'session_id' : session_id}), 200  # Send back cookie

    except firebase_exceptions.OutOfRangeError as e:
        return jsonify({'error': str(e)}), 400  # Handle Firebase Auth errors
    
@auth_bp.route('/check_cookie', methods=['GET'])
def check_cookie():
    try:
        authToken = request.cookies.get('authToken')
        if not authToken:
            return jsonify({'message': 'Information missing'}), 404
        # Verify the token
        try:
            payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
            user_id = payload['uid'] # Access the uid from the payload
            return jsonify({'message': 'Protected resource accessed', 'user_id': user_id}, {'valid':True}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 400
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 303
    
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