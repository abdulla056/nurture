import random 

def deep_learning():
    risk = random.randint(24,83)

    return {'riskScore': risk, 'riskLevel': 'LOW' if risk < 33 else 'MEDIUM' if risk < 66 else 'HIGH'}