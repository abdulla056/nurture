from firebase_admin import credentials, auth, firestore # type: ignore
import firebase_admin.exceptions as firebase_exceptions #type: ignore
from flask import request, jsonify, Blueprint, make_response
from config import Config
from marshmallow import Schema, fields, validate, ValidationError
import bcrypt
import jwt
from datetime import datetime, timedelta
from google.cloud.firestore_v1.base_query import FieldFilter



secret_key = Config.SECRET_KEY
temp_key = Config.TEMP_KEY
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

# Login Route to verify token sent in from Firebase, generates a temporary 5 minute token.
@auth_bp.route('/verify_token', methods=['POST'])
def verify_token():
    try:
        data = request.get_json()
        id_token = data.get('token')
        email = data.get('email')
        if not id_token:
            return jsonify({'error': 'Token is required'}), 400


        decoded_token = auth.verify_id_token(id_token)
        print("decoded")
        uid = decoded_token['uid']

        payload = {
            'uid': uid,
            'email' : email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=5),
        }

        temp_token = jwt.encode(payload, temp_key, algorithm='HS256')

        return jsonify({
            'message': 'MFA required',
            'temp_token': temp_token,  # Include the temporary token
        }), 200

    except auth.InvalidIdTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except auth.ExpiredIdTokenError:
        return jsonify({'error': 'Token has expired'}), 402
    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        return jsonify({'error': 'An internal error occurred. Please try again later.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Verifies the temporary token before sending the user to MFA page
@auth_bp.route('/verify_mfa', methods=['POST'])
def verify_mfa():
    print("verify_mfa")
    temp_token = request.args.get('temp_token')  # Get the temporary token from the query string

    if not temp_token:
        return jsonify({'error': 'Temporary token is required'}), 401

    # Verify the temporary token
    try:
        uid = jwt.decode(temp_token, temp_key, algorithms=['HS256'])
    except jwt.ExpiredSignatureError or jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid or expired temporary token'}), 401  # Token has expired
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid or expired temporary token'}), 402  # Invalid token
        

    # Render the MFA page
    return jsonify({'message': 'MFA page', 'uid': uid}), 200

# Sends verification code to the user's phone number
@auth_bp.route('/get_number', methods=['POST'])
def get_number():
    try:
        print('get_number')
        data = request.get_json()
        token = data['tempToken']  
        # Ensure the token is a string
        decoded_token = jwt.decode(token, temp_key, algorithms=['HS256'])
        email = decoded_token['email']
        doctor_ref = db.collection('doctors').where(filter=FieldFilter("email", "==", email))
        doctor = doctor_ref.get()
        
        if doctor:
            phone_number = doctor[0].to_dict()['phoneNumber']
            if phone_number:
                print(phone_number)
                return jsonify({'message': 'Verification code sent', 'phoneNumber': phone_number}), 200
            else:
                return jsonify({'error': 'Phone number not found'}), 404
        else:
            return jsonify({'error': 'Doctor not found'}), 404
    except Exception as e:
        print(f"Error getting number: {e}")  # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message    

## Not tested
@auth_bp.route('/verify_otp', methods=['POST'])
def verify_phone():
    print('verify_otp')
    try:
        data = request.get_json()
        confirmation_result = data.get('confirmationResult')
        print(data)
        token = data['tempToken'] 
        decoded_token = jwt.decode(token, temp_key, algorithms=['HS256'])
        email = decoded_token['email']
        doctor_ref = db.collection('doctors').where("email", "==", email)
        doctor = doctor_ref.get()
        uid = doctor[0].to_dict()['doctorId']
        email = doctor[0].to_dict()['email']

        if not uid:
            return jsonify({'error': 'Doctor not found'}), 404

        if not confirmation_result or not otp:
            return jsonify({'error': 'Confirmation result is required'}), 400
        
        payload = {
            'uid': uid,
            'email': email,
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
    except Exception as e:
        print(f"Error verifying OTP: {e}")
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
        password = validated_data['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        license = validated_data['doctorLicense']
        workplace = validated_data['workplace']

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
        except firebase_exceptions.UnauthenticatedError as e:
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

# @auth_bp.route('/check_header', methods=['GET'])
# def protected_resource():
#     try:
#         auth_header = request.headers.get('Authorization')

#         if not auth_header:
#             return jsonify({'error': 'Authorization header missing'}), 401
#         token = auth_header.split(' ')[1]  # Extract the token (remove "Bearer ")
#         # Verify the token
#         try:
#             payload = jwt.decode(token, secret_key, algorithms=['HS256']) # Use the same secret
#             user_id = payload['uid'] # Access the uid from the payload
#             return jsonify({'message': 'Protected resource accessed', 'user_id': user_id}), 200

#         except jwt.ExpiredSignatureError:
#             return jsonify({'error': 'Token expired'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'error': 'Invalid token'}), 401

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
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