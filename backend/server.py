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

from routes.doctor_routes import doctor_bp
from routes.patient_routes import patient_bp
from routes.prediction_routes import prediction_bp
from routes.feedback_routes import feedback_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)


app.register_blueprint(doctor_bp, url_prefix='/doctor')
app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(prediction_bp, url_prefix='/prediction')
app.register_blueprint(feedback_bp, url_prefix='/feedback')

if __name__ == '__main__':
    app.run(debug=True, port=app.config['PORT'])


print ("Hello")
