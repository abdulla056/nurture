from dotenv import load_dotenv
import os
import json

load_dotenv()  # Load environment variables

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
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
        "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    }
