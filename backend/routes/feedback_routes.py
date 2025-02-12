from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
feedback_bp = Blueprint('feedback_bp', __name__)
## Functionality for adding feedback
@feedback_bp.route('/add', methods=['POST'])
def add_feedback():
    try:
        data = request.json
        feedback_ref = db.collection('feedback').document(data['feedbackId'])
        feedback_ref.set({
            'doctorId': data['doctorId'],
            'systemAccuracy': data['systemAccuracy'],
            'predictionTime': data['predictionTime'],
            'interface': data['interface'],
            'helpfulness': data['helpfulness'],
            'additionalComments': data['additionalComments']
        })
        return jsonify({"message": "Feedback added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Getting feedback by FeedbackID
@feedback_bp.route('/get/<FeedbackID>', methods=['GET'])
def get_feedback(FeedbackID):
    try:
        feedback_ref = db.collection('feedback').document(FeedbackID)
        feedback = feedback_ref.get()
        
        if feedback.exists:
            return jsonify(feedback.to_dict()), 200
        else:
            return jsonify({"error": "FeedbackID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400