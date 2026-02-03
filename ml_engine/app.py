from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load the Trained Model
# We load it here so we don't have to reload it for every single request
print("Loading model...")
model = joblib.load('loan_model.pkl')
print("Model loaded!")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from Node.js
        data = request.json
        
        input_df = pd.DataFrame([{
             'Age': data['age'],
            'Monthly_Income': data['monthly_income'],
            'Current_EMIs': data['current_emis'],
            'Employment_Type': data['employment_type'], 
            'Credit_Score': data['credit_score'],
            'Loan_Amount': data['loan_amount'],
            'Tenure_Years': data['tenure_years']
        }])

        # Predicting Probability
        prediction_prob = model.predict_proba(input_df)
        approval_chance = prediction_prob[0][1] * 100 

        return jsonify({
            'status': 'success',
            'approval_probability': round(approval_chance, 2)
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    # Run on Port 5001 Change to .env in future
    app.run(port=5001, debug=True)