# rate_limiter.py
from flask import request, jsonify
from datetime import datetime, timedelta
import time

# In-memory storage for request counts
request_counts = {}

def rate_limit(max_requests, window_size):
    """
    Custom rate-limiting decorator.
    :param max_requests: Maximum number of requests allowed.
    :param window_size: Time window in seconds.
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Get the client's IP address
            client_ip = request.remote_addr

            # Get the current timestamp
            now = time.time()

            # Initialize the request count for the client if it doesn't exist
            if client_ip not in request_counts:
                request_counts[client_ip] = []

            # Remove old requests that are outside the time window
            request_counts[client_ip] = [
                timestamp for timestamp in request_counts[client_ip]
                if now - timestamp <= window_size
            ]

            # Check if the client has exceeded the rate limit
            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "message": f"You have exceeded the limit of {max_requests} requests per {window_size} seconds."
                }), 429

            # Add the current request timestamp
            request_counts[client_ip].append(now)

            # Call the original function
            return func(*args, **kwargs)
        return wrapper
    return decorator