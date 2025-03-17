# rate_limiter.py
from flask import request, jsonify
from datetime import datetime, timedelta
import time
from functools import wraps

# In-memory storage for request counts
request_counts = {}

def rate_limit(max_requests, window_size):
    """
    Custom rate-limiting decorator.
    :param max_requests: Maximum number of requests allowed.
    :param window_size: Time window in seconds.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get the client's IP address
            client_ip = request.remote_addr
            # Create a unique key for the client and route
            route_key = f"{client_ip}:{request.endpoint}"
            # Get the current timestamp
            now = time.time()

            # Initialize the request count for the client and route if it doesn't exist
            if route_key not in request_counts:
                request_counts[route_key] = []

            # Remove old requests that are outside the time window
            request_counts[route_key] = [
                timestamp for timestamp in request_counts[route_key]
                if now - timestamp <= window_size
            ]

            # Print the number of requests made by the client for this route
            request_count = len(request_counts[route_key])
            print(f"Client {client_ip} has made {request_count} requests to {request.endpoint} in the last {window_size} seconds.")

            # Check if the client has exceeded the rate limit
            if request_count >= max_requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "message": f"You have exceeded the limit of {max_requests} requests per {window_size} seconds."
                }), 429

            # Add the current request timestamp
            request_counts[route_key].append(now)

            # Call the original function
            return func(*args, **kwargs)
        return wrapper
    return decorator