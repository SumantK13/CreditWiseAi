from flask import Flask, request, jsonify
import pandas as pd
import joblib


app = Flask(__name__)

# Load model and column structure
print("Loading model...")
try:
    model = joblib.load('loan_model.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("✅ Model loaded successfully!")
    print(f"✅ Expected columns: {model_columns}")
except Exception as e:
    print(f"❌ Error loading model: {e}")

print(f"✅ Model classes: {model.classes_}")

import numpy as np
for col, imp in sorted(zip(model_columns, model.feature_importances_), key=lambda x: -x[1]):
    print(f"{col}: {imp:.4f}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Build raw input
        raw_input = {
            'Monthly_Income':           data['monthly_income'],
            'Current_EMIs':             data['current_emis'],
            'Credit_Score':             data['credit_score'],
            'Loan_Amount':              data['loan_amount'],
            'Tenure_Years':             data['tenure_years'],
            'Age':                      data['age'],
            'Bank_Interest_Rate':       data['bank_interest_rate'],
            'Processing_Fee_Percentage': data['processing_fee'],
            'Minimum_Tenure_Allowed':   data['min_tenure'],
            'Maximum_Tenure_Allowed':   data['max_tenure'],
            'Employment_Type':          data['employment_type'].title()
        }

        input_df = pd.DataFrame([raw_input])

        # One-hot encode Employment_Type to match training structure
        input_df = pd.get_dummies(input_df, columns=['Employment_Type'], drop_first=False)

        # Align columns to exactly match training — fills missing ones with 0
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        # Predict
        prediction_prob = model.predict_proba(input_df)
        # approval_chance = prediction_prob[0][1] * 100

        # return jsonify({
        #     'status': 'success',
        #     'approval_probability': round(approval_chance, 2)
        # })
        # prediction_prob = model.predict_proba(input_df)
        
        # FIX: Wrap the entire calculation in float() to make it JSON serializable
        approval_chance = float(prediction_prob[0][1] * 100)

        print(f"🎯 Calculated Probability: {approval_chance}%")

        return jsonify({
            'status': 'success',
            'approval_probability': round(approval_chance, 2)
        })
    except KeyError as k:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(k)}'}), 400

    # except Exception as e:
    #     return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)