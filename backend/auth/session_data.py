import redis
import json
from flask import jsonify

redis_client = redis.from_url('redis://localhost:6341')

def get_session_by_sid(sid):
    try:    
        session_data = redis_client.get(f"session:{sid}")
        
        if session_data:
            session_data_str = session_data.decode('utf-8')
            session_dict = json.loads(session_data_str)
            return session_dict
        else:
            return jsonify({'error':"Session not found"}), 404
    except Exception as e:
        print(f"Error getting number: {e}")  # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message    

    
    
    
def update_session(sid, updated_session_dict):
    try:
        updated_session_data = json.dumps(updated_session_dict)
        redis_client.set(f"session:{sid}", updated_session_data)
        return jsonify({'message':"Session updated"}), 200
    except Exception as e:
        print(f"Error getting number: {e}")  # Log the error
        return jsonify({'error': 'An error occurred'}), 500  # Generic error message   