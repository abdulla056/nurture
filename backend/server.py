from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)
print("dawg")
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
    try:
        ## Takes in a .json file
        data = request.json
        doctor_ref = db.collection('doctors').document(data['doctorId'])
        doctor_ref.set({
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'licenseNumber': data['licenseNumber'],
            'workplace': data['workplace']
        })
        return jsonify({"message": "Doctor added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


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

## Get Doctor by ID
@app.route('/get_doctor/<DoctorID>', methods=['GET'])
def get_doctor(DoctorID):
    try:
        doctor_ref = db.collection('doctors').document(DoctorID)
        doctor = doctor_ref.get()
        
        if doctor.exists:
            return jsonify(doctor.to_dict()), 200
        else:
            return jsonify({"error": "Doctor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Functionality for adding a new patient
@app.route('/add_patient', methods=['POST'])
def add_patient():
    try:
        data = request.json
        patient_ref = db.collection('patients').document(data['patientId'])
        patient_ref.set({
            'doctorId': data['doctorId'],
            'detailId': data['detailId']
        })
        return jsonify({"message": "Patient added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Get the patients that are being managed by the doctor
@app.route('/get_patients/<DoctorID>', methods=['GET'])
def get_patients(DoctorID):
    try:
        patients_ref = db.collection('patients').where("doctorId", "==", DoctorID).stream()
        patients = [doc.to_dict() for doc in patients_ref]
        
        if patients:
            return jsonify(patients), 200
        else:
            return jsonify({"message": "No patients found for this doctor"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Functionality for adding feedback
@app.route('/add_feedback', methods=['POST'])
def add_feedback():
    try:
        data = request.json
        feedback_ref = db.collection('feedback').document(data['feedbackId'])
        feedback_ref.set({
            'doctorId': data['doctorId'],
            'systemAccuracy': data['systemAccuracy'],
            'predictionTime': data['predictionTime'],
            'interface': data['interface'],
            'helpfulness': data['helpfulness'],
            'additionalComments': data['additionalComments']
        })
        return jsonify({"message": "Feedback added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Getting feedback by FeedbackID
@app.route('/get_feedback/<FeedbackID>', methods=['GET'])
def get_feedback(FeedbackID):
    try:
        feedback_ref = db.collection('feedback').document(FeedbackID)
        feedback = feedback_ref.get()
        
        if feedback.exists:
            return jsonify(feedback.to_dict()), 200
        else:
            return jsonify({"error": "FeedbackID not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
## Adding patient details    
@app.route('/add_patient_details', methods=['POST'])
def add_patient_details():
    try:
        data = request.json
        details_ref = db.collection('details').document(data['detailId'])
        details_ref.set({
            'patientId': data['patientId'],
            'timestamp': datetime.utcnow(),
            'age': data['age'],
            'gender': data['gender'],
            'weight': data['weight'],
            'height': data['height'],
            'bmi': data['bmi'],
            'bloodPressure': data['bloodPressure'],
            'heartRate': data['heartRate'],
            'smokingStatus': data['smokingStatus'],
            'alcoholConsumption': data['alcoholConsumption'],
            'dietaryHabits': data['dietaryHabits'],
            'exerciseFrequency': data['exerciseFrequency'],
            'existingConditions': data['existingConditions'],
            'medications': data['medications'],
            'surgicalHistory': data['surgicalHistory'],
            'familyMedicalHistory': data['familyMedicalHistory'],
            'birthWeight': data['birthWeight'],
            'gestationalAge': data['gestationalAge'],
            'maternalHealthComplications': data['maternalHealthComplications'],
            'multiplePregnancy': data['multiplePregnancy'],
            'congenitalAnomalies': data['congenitalAnomalies'],
            'pretermBirth': data['pretermBirth'],
            'lowBirthWeight': data['lowBirthWeight']
        })
        return jsonify({"message": "Patient details added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

## Add prediction for patient
@app.route('/add_prediction', methods=['POST'])
def add_prediction():
    try:
        data = request.json
        prediction_ref = db.collection('predictions').document(data['predictionId'])
        prediction_ref.set({
            'patientId': data['patientId'],
            'doctorId': data['doctorId'],
            'detailId' : data['detailId'],
            'predictionResult': data['predictionResult'],
            'confidenceScore': data['confidenceScore'],
            'timestamp': datetime.utcnow()
        })

        contributing_factors_ref = prediction_ref.collection('contributingFactors')
        for factor, details in data['contributingFactors'].items():
            contributing_factors_ref.document(factor).set({
                'factor': factor,
                'description': details['desc'],
                'contributionPercentage': details['percentage']
        })
        
        return jsonify({"message": "Prediction added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

## Fetch prediction by predictionID
@app.route('/get_prediction/<PredictionID>', methods=['GET'])
def get_prediction(PredictionID):
    prediction_ref = db.collection('predictions').document(PredictionID)
    prediction = prediction_ref.get()

    if prediction.exists:
        return jsonify(prediction.to_dict()), 200
    else:
        return jsonify({"error": "Prediction not found"}), 404

## Fetch all predictions for a certain patient
@app.route('/get_predictions/<PatientID>', methods=['GET'])
def get_predictions(PatientID):
    predictions_ref = db.collection('predictions').where("patientId", "==", PatientID).stream()
    predictions = [doc.to_dict() for doc in predictions_ref]

    if predictions:
        return jsonify(predictions), 200
    else:
        return jsonify({"message": "No predictions found for this patient"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5001)

