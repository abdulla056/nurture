from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

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
    try:
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
        patient_ref = db.collection('patients').document(data['PatientID'])
        patient_ref.set({
            'DoctorID': data['DoctorID'],
            'DetailID': data['DetailID']
        })
        return jsonify({"message": "Patient added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


## Get the patients that are being managed by the doctor
@app.route('/get_patients/<DoctorID>', methods=['GET'])
def get_patients(DoctorID):
    try:
        patients_ref = db.collection('patients').where("DoctorID", "==", DoctorID).stream()
        patients = [{doc.id: doc.to_dict()} for doc in patients_ref]
        
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
        feedback_ref = db.collection('feedback').document(data['FeedbackID'])
        feedback_ref.set({
            'DoctorID': data['DoctorID'],
            'SystemAccuracy': data['SystemAccuracy'],
            'PredictionTime': data['PredictionTime'],
            'Interface': data['Interface'],
            'Helpfulness': data['Helpfulness'],
            'AdditionalComments': data['AdditionalComments']
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
        data = request.get_json()

        # Extract DoctorID and PatientID from request
        doctor_id = data["DoctorID"]
        patient_id = data["PatientID"]

        # Generate accurate timestamp
        timestamp = datetime.now()

        # Add to Details Collection
        details_data = {
            "DoctorID": doctor_id,
            "PatientID": patient_id,
            "TimeDate": timestamp  # Store accurate timestamp
        }
        details_ref = db.collection("Details").add(details_data)
        detail_id = details_ref[1].id  # Get Firestore-generated ID

        # Add Demographic Data
        demographic_data = data["Details"]["Demographic"]
        demographic_data["DetailID"] = detail_id
        db.collection("Demographic").add(demographic_data)

        # Add Lifestyle Data
        lifestyle_data = data["Details"]["Lifestyle"]
        lifestyle_data["DetailID"] = detail_id
        db.collection("Lifestyle").add(lifestyle_data)

        # Add Conditions Data
        conditions_data = data["Details"]["Conditions"]
        conditions_data["DetailID"] = detail_id
        db.collection("Conditions").add(conditions_data)

        # Add BirthInfo Data
        birthinfo_data = data["Details"]["BirthInfo"]
        birthinfo_data["DetailID"] = detail_id
        db.collection("BirthInfo").add(birthinfo_data)

        # Add Flags Data
        flags_data = data["Details"]["Flags"]
        flags_data["DetailID"] = detail_id
        db.collection("Flags").add(flags_data)

        return jsonify({"message": "Patient details added successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

## Add prediction for patient
@app.route('/add_prediction', methods=['POST'])
def add_prediction():
    try:
        data = request.json
        prediction_ref = db.collection('Predictions').document(data['PredictionID'])
        prediction_ref.set({
            'PatientID': data['PatientID'],
            'DoctorID': data['DoctorID'],
            'PredictionResult': data['PredictionResult'],
            'ConfidenceScore': data['ConfidenceScore'],
            'Timestamp': datetime.utcnow()
        })
        return jsonify({"message": "Prediction added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

## Fetch prediction by predictionID
@app.route('/get_prediction/<PredictionID>', methods=['GET'])
def get_prediction(PredictionID):
    prediction_ref = db.collection('Predictions').document(PredictionID)
    prediction = prediction_ref.get()

    if prediction.exists:
        return jsonify(prediction.to_dict()), 200
    else:
        return jsonify({"error": "Prediction not found"}), 404

## Fetch all predictions for a certain patient
@app.route('/get_predictions/<PatientID>', methods=['GET'])
def get_predictions(PatientID):
    predictions_ref = db.collection('Predictions').where("PatientID", "==", PatientID).stream()
    predictions = [{doc.id: doc.to_dict()} for doc in predictions_ref]

    if predictions:
        return jsonify(predictions), 200
    else:
        return jsonify({"message": "No predictions found for this patient"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5001)


print ("Hello")
