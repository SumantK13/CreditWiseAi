from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load the New Pipeline (Preprocessor + Logistic Regression)
print("Loading model...")
try:
    model = joblib.load('loan_model.pkl')
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("Make sure 'loan_model.pkl' exists in the same folder.")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from Node.js
        data = request.json
        
        input_df = pd.DataFrame([{
            # --- User Details ---
            'Monthly_Income': data['monthly_income'],
            'Current_EMIs': data['current_emis'],
            'Employment_Type': data['employment_type'].title(), 
            'Credit_Score': data['credit_score'],
            'Loan_Amount': data['loan_amount'],
            'Tenure_Years': data['tenure_years'],
            'Age': data['age'],                               
            
            # --- Bank Specific Details ---
            'Bank_Interest_Rate': data['bank_interest_rate'],       
            'Processing_Fee_Percentage': data['processing_fee'],    
            'Minimum_Tenure_Allowed': data['min_tenure'],           
            'Maximum_Tenure_Allowed': data['max_tenure']            
        }])

        # --- OPTIONAL: DEBUGGING PRINT ---
        # print(f"Predicting for Bank Rate: {data['bank_interest_rate']}% | Tenure: {data['tenure_years']} yrs")
        # ---------------------------------

        # Predicting Probability
        prediction_prob = model.predict_proba(input_df)
        
        approval_chance = prediction_prob[0][1] * 100 

        return jsonify({
            'status': 'success',
            'approval_probability': round(approval_chance, 2)
        })

    except KeyError as k:
        return jsonify({'status': 'error', 'message': f'Missing required field: {str(k)}'}), 400
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)