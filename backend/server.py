from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from flask_session import Session # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore
from datetime import datetime, timedelta
from config import Config
import redis
import secrets
from auth.session_data import CustomRedisSessionInterface

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

## Create the Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_REDIS'] = redis.from_url("redis://localhost:6341")
app.config['SESSION_KEY_PREFIX'] = "flask_session:"
app.config['SESSION_SERIALIZATION_FORMAT'] = 'json'
CORS(app, supports_credentials=True)
app.secret_key = secrets.token_hex(256)

# Create a Redis client
redis_client = redis.from_url("redis://localhost:6341")

# Initialize the custom session interface
app.session_interface = CustomRedisSessionInterface(
    redis_client=redis_client,
    key_prefix=app.config['SESSION_KEY_PREFIX'],
    ttl=300  # Default TTL of 300 seconds
)

Session(app)

## Register the routes
app.register_blueprint(doctor_bp, url_prefix='/doctor')
app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(details_bp, url_prefix='/details')
app.register_blueprint(feedback_bp, url_prefix='/feedback')
app.register_blueprint(supervised_bp, url_prefix='/supervised')
app.register_blueprint(auth_bp, url_prefix='/auth')

## Default route
if __name__ == '__main__':
    app.run(debug=True, port=app.config['PORT'])