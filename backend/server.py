from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore
from datetime import datetime
from config import Config

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
# from routes.supervised_routes import supervised_bp
from routes.authentication_routes import auth_bp
from routes.dl_routes import dl_bp

## Create the Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

## Register the routes
app.register_blueprint(doctor_bp, url_prefix='/doctor')
app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(details_bp, url_prefix='/details')
app.register_blueprint(feedback_bp, url_prefix='/feedback')
# app.register_blueprint(supervised_bp, url_prefix='/supervised')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(dl_bp, url_prefix='/dl')

## Default route
if __name__ == '__main__':
    app.run(debug=True, port=app.config['PORT'])