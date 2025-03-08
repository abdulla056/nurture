import redis 
import json
from flask import jsonify, session
from flask.sessions import SessionInterface

redis_client = redis.from_url('redis://localhost:6341')

class CustomRedisSessionInterface(SessionInterface):
    def __init__(self, redis_client, key_prefix, use_signer=False, permanent=True, ttl=300):
        self.redis = redis_client
        self.key_prefix = key_prefix
        self.use_signer = use_signer
        self.permanent = permanent
        self.ttl = ttl  # Default TTL in seconds

    def open_session(self, app, request):
        # Implement session opening logic (if needed)
        pass

    def save_session(self, app, session, response):
        if not session:
            # If the session is empty, delete it from Redis
            if session.modified:
                self.redis.delete(f"{self.key_prefix}{session.sid}")
            return

        # Serialize the session data
        val = json.dumps(dict(session))

        # Set the session key in Redis
        key = f"{self.key_prefix}{session.sid}"
        self.redis.set(name=key, value=val)

        # Set TTL only if it doesn't already exist
        if self.redis.ttl(key) == -1:  # -1 means no TTL is set
            self.redis.expire(key, self.ttl)
    def create_session(self, email, redirect):
        """
        Create a new session and store it in Redis.
        """
        sid = self._generate_session_id()  # Generate a unique session ID
        session_data = {'email': email, 'redirect': redirect}
        self.redis.setex(name=f"{self.key_prefix}{sid}", time=self.ttl, value=json.dumps(session_data))
        return sid
    
    def get_session_by_sid(self, sid):
        """
        Retrieve session data by session ID (SID).
        """
        key = f"{self.key_prefix}{sid}"
        session_data = self.redis.get(key)
        if session_data:
            return json.loads(session_data.decode('utf-8'))
        return None
    
    def update_session(self, sid, data):
        """
        Update session data in Redis.
        """
        key = f"{self.key_prefix}{sid}"
        session_data = self.get_session_by_sid(sid)
        if session_data:
            session_data.update(data)  # Merge new data with existing session data
            self.redis.setex(name=key, time=self.ttl, value=json.dumps(session_data))
            return True
        return False

    def delete_session_by_sid(self, sid):
        """
        Delete a session from Redis by session ID.
        """
        key = f"{self.key_prefix}{sid}"
        return self.redis.delete(key)
    
    def _generate_session_id(self):
        """
        Generate a unique session ID.
        """
        import uuid
        return str(uuid.uuid4())