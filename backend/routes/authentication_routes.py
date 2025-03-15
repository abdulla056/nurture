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
from auth.firebase import verify_firebase_token, get_next_id
from random import randint
from auth.session_data import CustomRedisSessionInterface
import redis
import os
from auth.rate_limiter import rate_limit
import logging

secret_key = Config.SECRET_KEY
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()
auth_bp = Blueprint('auth_bp', __name__)

auth_logger = logging.getLogger("auth")
auth_logger.setLevel(logging.INFO)

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
redis_client = redis.from_url(Config.redis_url)  # Replace with your Redis URL
custom_session_interface_login = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix=Config.login_session_prefix,  # Unique prefix for session keys
    ttl=Config.login_session_ttl  # Default TTL of 300 seconds
)

custom_session_interface_csrf = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix=Config.csrf_token_prefix,  # Unique prefix for CSRF tokens
    ttl= Config.csrf_token_ttl # Default TTL of 1 hour
)

def protected_route(request, state):
    try:
        ip = request.remote_addr    
        authToken = request.cookies.get('authToken')
        csrf_token = request.headers.get('X-CSRF-Token')
        custom_session_interface_csrf.get_session_by_csrf_token(csrf_token)
        if authToken and state == 'get':
            # Verify the token
            try:
                payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
                user_id = payload['uid'] # Access the uid from the payload
                return {'message': 'Protected resource accessed', 'user_id': user_id,'valid':True}
            except jwt.ExpiredSignatureError:
                auth_logger.warning(f"Unauthorized access with expired JWT token, IP: {ip}")
                return {'error': 'Token expired','valid':False}
            except jwt.InvalidTokenError:
                auth_logger.warning(f"Unauthorized access with invalid JWT token, IP: {ip}")
                return {'error': 'Invalid token','valid':False}
        elif authToken and csrf_token and (state == 'post' or state == 'put' or  state == 'delete'):
            # Verify the token
            try:
                payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
                user_id = payload['uid'] # Access the uid from the payload
                return {'message': 'Protected resource accessed', 'user_id': user_id,'valid':True}
            except jwt.ExpiredSignatureError:
                auth_logger.warning(f"Unauthorized access with expired JWT token, IP: {ip}")
                return {'error': 'Token expired','valid':False}
            except jwt.InvalidTokenError:
                auth_logger.warning(f"Unauthorized access with invalid JWT token, IP: {ip}")
                return {'error': 'Invalid token','valid':False}
        else:
            auth_logger.warning(f"Unauthorized access without JWT token or CSRF token, IP: {ip}")
            return {'error': 'Unauthorized','valid':False}
    except Exception as e:
        return jsonify({'error': str(e)}), 303

# Login Route to verify token sent in from Firebase, generates a temporary 5 minute token.
@auth_bp.route('/verify_token', methods=['POST'])
@rate_limit(max_requests=20, window_size=60) 
def verify_token():
    try:
        data = request.get_json()
        id_token = data.get('token')
        email = data.get('email')
        if not id_token:
            auth_logger.warning(f"Unauthorized access without JWT token, IP: {request.remote_addr}")
            return jsonify({'error': 'Token is required'}), 400

        decoded_token = verify_firebase_token(id_token) #auth.verify_id_token(id_token)
        email = decoded_token['email']
        redirect = 'login'
        session_id = custom_session_interface_login.create_session(email, redirect)
        if session_id:
            auth_logger.info(f"Temporary session created for {email}, IP: {request.remote_addr}")
            return jsonify({
                'message' : 'MFA required',
                'session_id' : session_id
            }), 200
        else:
            auth_logger.warning(f"Failed to create session, IP: {request.remote_addr}")
            return jsonify({'error': 'Failed to create session'}), 402
    except Exception as e:
        auth_logger.warning(f"Error verifying token: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': 'An internal error occurred. Please try again later.'}), 500

# Sends verification code to the user's phone number
@auth_bp.route('/send_email', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
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
            auth_logger.info(f"MFA code sent to {email}, IP: {request.remote_addr}")
            return jsonify({'message' : "MFA code has been sent out", "session_id" : session_id}), 200
        elif session_data and session_data['redirect'] == 'register':
            session_data['mfa'] = randint(100000, 999999)
            name = session_data['first_name'] + " " + session_data['last_name']
            sendMessage(session_data['email'], name, session_data['mfa'])
            custom_session_interface_login.update_session(session_id, session_data)
            auth_logger.info(f"MFA code sent to {session_data['email']}, IP: {request.remote_addr}")
            return jsonify({'message' : "MFA code has been sent out", "session_id" : session_id}), 200
        else:
            auth_logger.warning(f"Session expired, IP: {request.remote_addr}")
            return jsonify({'error': "Session expired, please reload and try again."}), 401
    except Exception as e:
        auth_logger.error(f"Error sending email: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message    

## Not tested
@auth_bp.route('/verify_otp', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def verify_otp():
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
            if not uid:
                auth_logger.error(f"Doctor not found, IP: {request.remote_addr}")
                return jsonify({'error': 'Doctor not found'}), 404

            if int(code) == int(session_data['mfa']):
                payload = {
                'uid': uid,
                'email': email,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=1)  # Example: 1-hour expiration
                }
                token = jwt.encode(payload, secret_key, algorithm='HS256')
                custom_session_interface_login.delete_session_by_sid(session_id, 'login') 
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
                auth_logger.warning(f"Invalid verification code, IP: {request.remote_addr}")
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
                except Exception as e:
                    auth_logger.error(f"Error creating user: {str(e)}, IP: {request.remote_addr}")
                    return jsonify({'error': "There was an error adding doctor"}), 501
                doctor_id = get_next_id('doctor')
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
                    auth_logger.error(f"Error adding doctor: {str(e)}, IP: {request.remote_addr}")
                    return jsonify({"error": "There was an error adding doctor."}), 500
                
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
                auth_logger.info(f"Doctor {doctor_id} added, IP: {request.remote_addr}")
                return response
            else:
                auth_logger.warning(f"Invalid verification code, IP: {request.remote_addr}")
                return jsonify({'error': 'Invalid verification code'}), 400
        else:
            auth_logger.warning(f"Session expired, IP: {request.remote_addr}")
            return jsonify({'error': "Session expired, please reload and try again."}), 401
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        auth_logger.warning(f"Invalid or expired temporary token, IP: {request.remote_addr}")
        return jsonify({'error': 'Invalid or expired temporary token'}), 401  # Token has expired
    except Exception as e:
        auth_logger.error(f"Error verifying OTP: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': "An error occurred"}), 500  # Handle other errors

## Registration 
@auth_bp.route('/register', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
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
        custom_session_interface_login.update_session(session_id, session_data)
        auth_logger.info(f"Registration session created for {email}, IP: {request.remote_addr}")
        return jsonify({'message': 'Registration MFA required', 'session_id' : session_id}), 200  # Send back cookie
    except Exception as e:
        auth_logger.error(f"Error registering: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': "An error occurred"}), 400  # Handle Firebase Auth errors
    
@auth_bp.route('/check_cookie', methods=['GET'])
@rate_limit(max_requests=30, window_size=60) 
def check_cookie():
    try:
        authToken = request.cookies.get('authToken')
        if not authToken:
            return jsonify({'message': 'Information missing'}), 404
        # Verify the token
        try:
            payload = jwt.decode(authToken, secret_key, algorithms=['HS256']) # Use the same secret
            user_id = payload['uid'] # Access the uid from the payload
            auth_logger.info(f"Protected resource accessed, IP: {request.remote_addr}")
            return jsonify({'message': 'Protected resource accessed', 'user_id': user_id}, {'valid':True}), 200
        except jwt.ExpiredSignatureError:
            auth_logger.warning(f"Unauthorized access with expired JWT token, IP: {request.remote_addr}")
            return jsonify({'error': 'Token expired'}), 400
        except jwt.InvalidTokenError:
            auth_logger.warning(f"Unauthorized access with invalid JWT token, IP: {request.remote_addr}")
            return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        auth_logger.error(f"Error checking cookie: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': str(e)}), 303
    
@auth_bp.route('/send_password_reset_email', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def send_password_reset_email():
    try:
        data = request.get_json()  # Get the email from the request
        email = data.get('email')
        if not email:
            auth_logger.warning(f"Unauthorized access without email, IP: {request.remote_addr}")
            return jsonify({'error': 'Email is required'}), 400
        auth.send_password_reset_email(email)
        auth_logger.info(f"Password reset email sent to {email}, IP: {request.remote_addr}")
        return jsonify({'message': 'Password reset email sent'}), 200
    except Exception as e:
        auth_logger.error(f"Error sending password reset email: {str(e)}, IP: {request.remote_addr}") # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message
    
@auth_bp.route('/logout', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def logout():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            custom_session_interface_csrf.delete_session_by_sid(request.headers.get('X-CSRF-Token'), 'csrf')
            response = make_response(jsonify({"message": "Logout successful"}), 200)
            response.set_cookie("authToken", '', expires= 0, httponly=True, secure=True, samesite='None')
            auth_logger.info(f"Logout successful, IP: {request.remote_addr}")
            return response
        else:
            auth_logger.warning(f"Unauthorized access, IP: {request.remote_addr}")
            return jsonify({'error': 'Unauthorized'}), 401
    except Exception as e:
        auth_logger.error(f"Error logging out: {str(e)}, IP: {request.remote_addr}")
        return jsonify({'error': "An error occurred"}), 500