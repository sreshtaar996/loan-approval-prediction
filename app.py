from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import joblib
import uuid
from datetime import datetime
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Load the loan decision model
try:
    model = joblib.load('models/loan_decision_tree_20250518_053250.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def home():
    return render_template('1.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded properly'}), 500
        
    try:
        data = request.get_json()
        
        # Generate a loan ID (timestamp + random string)
        loan_id = int(datetime.now().strftime('%Y%m%d%H%M%S') + str(uuid.uuid4().int)[:4])
        
        # Create DataFrame with the input data
        input_df = pd.DataFrame({
            'loan_id': [loan_id],
            'no_of_dependents': [int(data.get('no_of_dependents', 0))],
            'education': [f" {data.get('education', 'Graduate')}"],
            'self_employed': [f" {data.get('self_employed', 'No')}"],
            'income_annum': [float(data.get('income_annum', 0))],
            'loan_amount': [float(data.get('loan_amount', 0))],
            'loan_term': [int(data.get('loan_term', 0))],
            'cibil_score': [int(data.get('cibil_score', 0))],
            'residential_assets_value': [float(data.get('residential_assets_value', 0))],
            'commercial_assets_value': [float(data.get('commercial_assets_value', 0))],
            'luxury_assets_value': [float(data.get('luxury_assets_value', 0))],
            'bank_asset_value': [float(data.get('bank_asset_value', 0))]
        })
        
        # Make prediction
        prediction = model.predict(input_df)
        prediction_prob = model.predict_proba(input_df)
        
        # Extract result
        result = prediction[0]
        probability = max(prediction_prob[0]) * 100
        
        # Calculate loan eligibility metrics
        dti_ratio = float(data.get('loan_amount', 0)) / float(data.get('income_annum', 1)) * 100
        asset_coverage = (float(data.get('residential_assets_value', 0)) + 
                          float(data.get('commercial_assets_value', 0)) + 
                          float(data.get('luxury_assets_value', 0)) + 
                          float(data.get('bank_asset_value', 0))) / float(data.get('loan_amount', 1))
        
        # Create response with additional insights
        response = {
            'loan_id': loan_id,
            'decision': result,
            'confidence': round(probability, 2),
            'metrics': {
                'dti_ratio': round(dti_ratio, 2),
                'asset_coverage': round(asset_coverage, 2),
                'credit_score': int(data.get('cibil_score', 0))
            },
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error making prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True)

