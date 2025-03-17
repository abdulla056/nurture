from dotenv import load_dotenv # type: ignore
import os
import json

load_dotenv()  # Load environment variables

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    APP_PASSWORD = os.getenv("APP_PASSWORD")
    GMAIL = os.getenv("GMAIL")
    PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
    # Load Firebase credentials from environment variables
    PORT = os.getenv("PORT")
    FIREBASE_CONFIG = { 
        "type": os.getenv("FIREBASE_TYPE"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),  # Convert string \n to actual new lines
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
        "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
    }
    redis_url = os.getenv('REDIS_URL')  # Default fallback
    login_session_prefix = os.getenv('LOGIN_SESSION_PREFIX')
    login_session_ttl = int(os.getenv('LOGIN_SESSION_TTL')) 
    csrf_token_prefix = os.getenv('CSRF_TOKEN_PREFIX')
    csrf_token_ttl = int(os.getenv('CSRF_TOKEN_TTL')) 
    ssl_cert_file = os.getenv('SSL_CERT_FILE')
    ssl_key_file = os.getenv('SSL_KEY_FILE')
    allowed_origins = os.getenv('ALLOWED_ORIGINS').split(',')
