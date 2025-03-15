from datetime import datetime
from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route
from auth.firebase import get_next_id
from auth.rate_limiter import rate_limit
import logging

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
feedback_bp = Blueprint('feedback_bp', __name__)

feedback_logger = logging.getLogger('feedback_logger')

## Functionality for adding feedback
@feedback_bp.route('/add', methods=['POST'])
@rate_limit(max_requests=10, window_size=60) 
def add_feedback():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            feedbackId = get_next_id('feedback')
            feedback_ref = db.collection('feedback').document(feedbackId)
            feedback_ref.set({
                'feedbackId': feedbackId,
                'doctorId': response['user_id'],
                'systemAccuracy': data['accuracy'],
                'additionalFeatures': data['additionalFeatures'],
                'easeOfUse': data['easeOfUse'],
                'intuitiveUI': data['intuitiveUI'],
                'improvements': data['improvements'],
                'userInterfaceImprovement': data['userInterfaceImprovement'],
                'timestamp': datetime.now().isoformat()
            })
            feedback_logger.info(f"Feedback added by DoctorID: {response['user_id']} with FeedbackID: {feedbackId}, IP: {request.remote_addr}")
            return jsonify({"message": "Feedback added successfully"}), 201
        else:
            feedback_logger.info(f"Unauthorized attempt to add feedback by IP: {request.remote_addr}")
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        feedback_logger.error(f"Error adding feedback: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 400


## Getting feedback by FeedbackID
@feedback_bp.route('/get/<FeedbackID>', methods=['GET'])
@rate_limit(max_requests=10, window_size=60) 
def get_feedback(FeedbackID):
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            feedback_ref = db.collection('feedback').document(FeedbackID)
            feedback = feedback_ref.get()
            
            if feedback.exists:
                feedback_logger.info(f"FeedbackID {FeedbackID} retrieved by Doctor {response['user_id']}, IP: {request.remote_addr}")
                return jsonify(feedback.to_dict()), 200
            else:
                feedback_logger.info(f"FeedbackID not found: {FeedbackID} requested by Doctor {response['user_id']}, IP: {request.remote_addr}")
                return jsonify({"error": "FeedbackID not found"}), 404
        else:
            feedback_logger.info(f"Unauthorized attempt to get feedback by IP: {request.remote_addr}")
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        feedback_logger.error(f"Error getting feedback: {str(e)}, IP: {request.remote_addr}")
        return jsonify({"error": "An error occurred"}), 400