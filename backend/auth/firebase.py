import requests
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.primitives import serialization
import jwt
import jwt
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
import datetime
import time
from config import Config
from firebase_admin import credentials, firestore

firebase_config_json = Config.FIREBASE_CONFIG
cred = credentials.Certificate(firebase_config_json)
db = firestore.client()

def fetch_firebase_public_keys():
    url = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def verify_firebase_token(token):
    # Fetch Firebase public keys
    public_keys = fetch_firebase_public_keys()

    # Decode the token header to get the key ID (kid)
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")

    if not kid or kid not in public_keys:
        raise InvalidTokenError("Invalid key ID (kid) in token.")

     # Get the X.509 certificate for the kid
    x509_cert = public_keys[kid]

    # Convert X.509 certificate to PEM-encoded key
    cert_obj = load_pem_x509_certificate(x509_cert.encode())
    public_key = cert_obj.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    project_id = Config.PROJECT_ID

    try:
        # Decode and verify the token
        decoded_token = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=f"{project_id}",  # Replace with your Firebase project ID
            issuer=f"https://securetoken.google.com/{project_id}",  # Replace with your Firebase project ID
            options={"verify_iat": True},  # Ensure iat is verified
            leeway=10,  # Allow a 10-second leeway for clock skew
        )
        return decoded_token
    except ExpiredSignatureError:
        raise InvalidTokenError("Token has expired.")
    except Exception as e:
        raise InvalidTokenError(f"Token verification failed: {str(e)}")
    
def get_next_id(document):
    prefixes = {
        "detail": "DD",
        "doctor": "D",
        "feedback": "F",
        "prediction": "PR"
    }
    prefix = prefixes[document]
    counter_ref = db.collection("counter").document(f"{document}_id")
    count = counter_ref.get()
    if not count.exists:
        raise Exception("Counter does not exist")
    next_id = count.to_dict()["nextId"]
    assigned_id = f"{prefix}{next_id:03}" # Format with leading zeros
    counter_ref.update({"nextId":int(next_id+1)})    
    return assigned_id  