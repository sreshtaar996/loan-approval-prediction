from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

# Initialize Flask app
app = Flask(__name__)

# Load pre-trained model and label encoders
model = joblib.load('loan_approval_model.pkl')
le_education = joblib.load('le_education.pkl')
le_self_employed = joblib.load('le_self_employed.pkl')

# Route to display the form
@app.route('/')
def index():
    return render_template('1.html')

# Route to handle the form submission and prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Get the individual features from the JSON
        bank_asset_value = float(data['bank_asset_value'])
        education = data['education']
        commercial_assets_value = float(data['commercial_assets_value'])
        income_annum = float(data['income_annum'])
        loan_amount = float(data['loan_amount'])
        luxury_assets_value = float(data['luxury_assets_value'])
        cibil_score = int(data['cibil_score'])
        loan_term = int(data['loan_term'])
        no_of_dependents = int(data['no_of_dependents'])
        residential_assets_value = float(data['residential_assets_value'])
        self_employed = data['self_employed']

        # Convert categorical data using label encoders
        education = le_education.transform([education])[0]
        self_employed = le_self_employed.transform([self_employed])[0]

        # Prepare the input features for prediction
        input_features = pd.DataFrame([[bank_asset_value, education, commercial_assets_value, income_annum,
                                        loan_amount, luxury_assets_value, cibil_score, loan_term,
                                        no_of_dependents, residential_assets_value, self_employed]],
                                      columns=['bank_asset_value', 'education', 'commercial_assets_value', 
                                               'income_annum', 'loan_amount', 'luxury_assets_value', 
                                               'cibil_score', 'loan_term', 'no_of_dependents', 
                                               'residential_assets_value', 'self_employed'])

        # Make prediction
        prediction = model.predict(input_features)[0]
        
        # Return result as JSON
        if prediction == 1:
            result = "Loan Approved"
        else:
            result = "Loan Rejected"
        
        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

