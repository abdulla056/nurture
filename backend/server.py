from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# Members API route
@app.route('/members')
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

## Access the Firestore 
cred = credentials.Certificate("../secrets/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

## Functionality to add a new doctor
@app.route('/add_doctor', methods=['POST'])
def add_doctor():
    ## Takes in a .json file
    data = request.json
    doctor_ref = db.collection('doctors').document(data['DoctorID'])
    doctor_ref.set({
        'FirstName': data['FirstName'],
        'LastName': data['LastName'],
        'Email': data['Email'],
        'LicenseNumber': data['LicenseNumber'],
        'Workplace': data['Workplace']
    })
    return jsonify({"message": "Doctor added successfully"}), 201


""" 
Windows Testing
$body = @{
    "DoctorID" = "D001"
    "FirstName" = "John"
    "LastName" = "Doe"
    "Email" = "john.doe@example.com"
    "LicenseNumber" = "12345"
    "Workplace" = "City Hospital"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:5000/add_doctor" -Method Post -Body $body -ContentType "application/json"
 """

"""
Mac Testing
curl -X POST "http://127.0.0.1:5000/add_doctor" \
    -H "Content-Type: application/json" \
    -d '{"FirstName": "John", "LastName": "Doe", "Email": "john.doe@example.com", "LicenseNumber": "123456", "Workplace": "City Hospital"}'

"""


if __name__ == '__main__':
    app.run(debug=True, port=5001)

