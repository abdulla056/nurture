from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from flask_session import Session # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore
from datetime import datetime, timedelta
from config import Config
import secrets
from auth.session_data import CustomRedisSessionInterface, redis_client
import ssl
import os

## Access the Firestore 
firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
firebase_admin.initialize_app(cred)
db = firestore.client()

## Import the routes
from routes.doctor_routes import doctor_bp
from routes.patient_routes import patient_bp
from routes.details_routes import details_bp
from routes.feedback_routes import feedback_bp
from routes.supervised_routes import supervised_bp
from routes.authentication_routes import auth_bp
from routes.unsupervised_routes import unsupervised_bp

## Create the Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
app.secret_key = secrets.token_hex(256)

# Initialize the custom session interface
app.session_interface = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix=Config.login_session_prefix,
    ttl=Config.login_session_ttl  # Default TTL of 300 seconds
)

## Register the routes
app.register_blueprint(doctor_bp, url_prefix='/doctor')
app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(details_bp, url_prefix='/details')
app.register_blueprint(feedback_bp, url_prefix='/feedback')
app.register_blueprint(supervised_bp, url_prefix='/supervised')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(unsupervised_bp, url_prefix='/unsupervised')

# Path to the .pem files
cert_path = os.path.join(os.path.dirname(__file__), Config.ssl_cert_file)
key_path = os.path.join(os.path.dirname(__file__), Config.ssl_key_file)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(cert_path, key_path)

## Default route
if __name__ == '__main__':
    app.run(debug=True, ssl_context=context,port=app.config['PORT'])