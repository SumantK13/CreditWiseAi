import pandas as pd
import numpy as np
import random

# Set seed for reproducibility (so you get the same 'random' data every time)
np.random.seed(42)

def generate_loan_data(num_samples=10000):
    data = []
    
    employment_types = ['Salaried', 'Self-Employed', 'Student']
    
    for _ in range(num_samples):
        # 1. Generate Basic Profiles (Realistic Ranges)
        monthly_income = np.random.randint(15000, 200000) # 15k to 2L
        
        # Current EMIs (usually 0 to 40% of income)
        current_emis = np.random.randint(0, int(monthly_income * 0.4))
        
        # Credit Score (300 to 900, weighted towards 650-750)
        credit_score = int(np.random.normal(700, 50))
        credit_score = max(300, min(900, credit_score)) # Clip range
        
        # Employment Type (Students have lower income usually, but we keep it random here)
        emp_type = np.random.choice(employment_types, p=[0.6, 0.3, 0.1])
        
        # Loan Requirements
        loan_amount = np.random.randint(50000, 5000000) # 50k to 50L
        tenure_years = np.random.randint(1, 15)
        
        # --- 2. THE "FUZZY" UNDERWRITING LOGIC ---
        
        # Calculate Ratios
        total_obligation = current_emis + (loan_amount * 0.015) # Approx EMI estimation
        foir = (total_obligation / monthly_income) * 100
        
        # Base Probability Score (Start at 0)
        probability = 0
        
        # A. Credit Score Impact (Strongest Factor)
        if credit_score > 750: probability += 0.50
        elif credit_score > 650: probability += 0.30
        else: probability -= 0.20
        
        # B. FOIR Impact (Debt Burden)
        if foir < 40: probability += 0.30
        elif foir < 60: probability += 0.10
        else: probability -= 0.40 # High debt penalty
        
        # C. Employment Stability
        if emp_type == 'Salaried': probability += 0.10
        if emp_type == 'Student': probability -= 0.15
        
        # D. Loan to Income Ratio
        if loan_amount > (monthly_income * 60): # Asking for > 5 years of income
            probability -= 0.20
            
        # --- 3. ADD "HUMAN NOISE" (The Realism) ---
        # Add random noise between -0.10 and +0.10
        # This means a borderline case might get lucky (or unlucky)
        noise = np.random.uniform(-0.10, 0.10)
        final_score = probability + noise
        
        # 4. Final Decision
        loan_status = 1 if final_score > 0.5 else 0
        
        data.append([monthly_income, current_emis, emp_type, credit_score, loan_amount, tenure_years, loan_status])

    # Convert to DataFrame
    df = pd.DataFrame(data, columns=[
        'Monthly_Income', 'Current_EMIs', 'Employment_Type', 
        'Credit_Score', 'Loan_Amount', 'Tenure_Years', 'Loan_Status'
    ])
    
    return df

# Run and Save
if __name__ == "__main__":
    print("Generating synthetic data...")
    df = generate_loan_data(10000)
    df.to_csv('loan_data.csv', index=False)
    print("✅ Data generated! Saved as 'loan_data.csv'")
    print(df.head()) 