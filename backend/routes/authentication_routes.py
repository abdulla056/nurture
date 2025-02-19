import firebase_admin
from firebase_admin import credentials, auth
from flask import request, jsonify, Blueprint
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
auth_bp = Blueprint('auth_bp', __name__)

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