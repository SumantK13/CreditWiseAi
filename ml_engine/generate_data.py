import pandas as pd
import numpy as np
import random

# Set seed for reproducibility
np.random.seed(42)

def generate_loan_data(num_samples=10000):
    data = []
    
    employment_types = ['Salaried', 'Self-Employed', 'Student']
    
    for _ in range(num_samples):
        # 1. Generate Basic Profiles
        # Age: 21 to 60 (Standard working age for loans)
        age = np.random.randint(21, 60) 

        monthly_income = np.random.randint(15000, 200000) 
        current_emis = np.random.randint(0, int(monthly_income * 0.4))
        
        credit_score = int(np.random.normal(700, 50))
        credit_score = max(300, min(900, credit_score))
        
        emp_type = np.random.choice(employment_types, p=[0.6, 0.3, 0.1])
        
        loan_amount = np.random.randint(50000, 5000000)
        tenure_years = np.random.randint(1, 15)
        
        # --- 2. THE "FUZZY" UNDERWRITING LOGIC ---
        
        # Calculate Ratios
        total_obligation = current_emis + (loan_amount * 0.015)
        foir = (total_obligation / monthly_income) * 100
        
        # Base Probability Score
        probability = 0
        
        # A. Credit Score Impact (Strongest Factor)
        if credit_score > 750: probability += 0.50
        elif credit_score > 650: probability += 0.30
        else: probability -= 0.20
        
        # B. FOIR Impact (Debt Burden)
        if foir < 40: probability += 0.30
        elif foir < 60: probability += 0.10
        else: probability -= 0.40
        
        # C. Employment Stability
        if emp_type == 'Salaried': probability += 0.10
        if emp_type == 'Student': probability -= 0.15
        
        # D. Loan to Income Ratio
        if loan_amount > (monthly_income * 60): 
            probability -= 0.20

        # E. Age Impact (NEW LOGIC)
        # Too young (<25) or near retirement (>55) is slightly riskier
        if age < 25: probability -= 0.05
        elif age > 55: probability -= 0.05
        else: probability += 0.05 # Prime working years
            
        # --- 3. ADD "HUMAN NOISE" ---
        noise = np.random.uniform(-0.10, 0.10)
        final_score = probability + noise
        
        # 4. Final Decision
        loan_status = 1 if final_score > 0.5 else 0
        
        # Add 'age' to the row
        data.append([age, monthly_income, current_emis, emp_type, credit_score, loan_amount, tenure_years, loan_status])

    # Convert to DataFrame (Added 'Age' to columns)
    df = pd.DataFrame(data, columns=[
        'Age', 'Monthly_Income', 'Current_EMIs', 'Employment_Type', 
        'Credit_Score', 'Loan_Amount', 'Tenure_Years', 'Loan_Status'
    ])
    
    return df

if __name__ == "__main__":
    print("Generating synthetic data with Age...")
    df = generate_loan_data(10000)
    df.to_csv('loan_data.csv', index=False)
    print("✅ Data generated! Saved as 'loan_data.csv'")
    print(df.head())