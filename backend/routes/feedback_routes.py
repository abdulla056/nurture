from datetime import datetime
from flask import Blueprint, request, jsonify # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials,firestore # type: ignore
from config import Config
from routes.authentication_routes import protected_route

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)

db = firestore.client()
feedback_bp = Blueprint('feedback_bp', __name__)
## Functionality for adding feedback
@feedback_bp.route('/add', methods=['POST'])
def add_feedback():
    try:
        response = protected_route(request, 'post')
        if response['valid']:
            data = request.json
            counter_ref = db.collection("counter").document("feedback_id")
            count = counter_ref.get()
            if not count.exists:
                raise Exception("Counter does not exist")
            next_id = count.to_dict()["nextId"]
            feedbackId = f"F{next_id:03}" # Format with leading zeros
            counter_ref.update({"nextId":int(next_id+1)})
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
            return jsonify({"message": "Feedback added successfully"}), 201
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Getting feedback by FeedbackID
@feedback_bp.route('/get/<FeedbackID>', methods=['GET'])
def get_feedback(FeedbackID):
    try:
        response = protected_route(request, 'get')
        if response['valid']:
            feedback_ref = db.collection('feedback').document(FeedbackID)
            feedback = feedback_ref.get()
            
            if feedback.exists:
                return jsonify(feedback.to_dict()), 200
            else:
                return jsonify({"error": "FeedbackID not found"}), 404
        else:
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400