import pandas as pd
import numpy as np

# 1. Load your base data
df = pd.read_csv('loan_data.csv')

# --- STEP 1: GENERATE SYNTHETIC BANK FEATURES ---
np.random.seed(42) # For consistent results

# A. User Age (21 to 59)
df['Age'] = np.random.randint(21, 60, size=len(df))

# B. Bank Interest Rate (8.5% to 18.0%)
# Simulates different bank offers
df['Bank_Interest_Rate'] = np.round(np.random.uniform(8.5, 18.0, size=len(df)), 2)

# C. Processing Fee (0.5% to 3.0% of Loan Amount)
# Some banks are expensive!
df['Processing_Fee_Percentage'] = np.round(np.random.uniform(0.5, 3.0, size=len(df)), 2)

# D. Tenure Constraints (The "Hard" Rules)
# Min Tenure: Usually 1 to 3 years
df['Minimum_Tenure_Allowed'] = np.random.randint(1, 4, size=len(df))
# Max Tenure: Usually 10 to 30 years
df['Maximum_Tenure_Allowed'] = np.random.randint(10, 31, size=len(df))


# --- STEP 2: CALCULATE REAL-WORLD METRICS ---

# Calculate EMI based on the *Specific* Bank Interest Rate
def calculate_emi(row):
    P = row['Loan_Amount']
    r = (row['Bank_Interest_Rate'] / 12) / 100
    n = row['Tenure_Years'] * 12
    if r == 0: return P/n
    return P * r * ((1 + r)**n) / (((1 + r)**n) - 1)

df['Monthly_EMI'] = df.apply(calculate_emi, axis=1)

# Calculate FOIR (Affordability)
# (Current Debt + New EMI) / Monthly Income
df['Total_Monthly_Debt'] = df['Current_EMIs'] + df['Monthly_EMI']
df['FOIR'] = (df['Total_Monthly_Debt'] / df['Monthly_Income']) * 100


# --- STEP 3: APPLY "SMART LABELS" (TEACHING THE AI) ---
# We flip the Loan_Status to 0 (Rejected) if the constraints are violated.

def smart_label(row):
    # 1. HARD CONSTRAINT: Tenure Violated?
    # If user asks for 5 years but bank demands min 7 -> REJECT
    if row['Tenure_Years'] < row['Minimum_Tenure_Allowed']:
        return 0
    # If user asks for 25 years but bank allows max 20 -> REJECT
    if row['Tenure_Years'] > row['Maximum_Tenure_Allowed']:
        return 0

    # 2. HARD CONSTRAINT: Affordability (FOIR)
    # If the Interest Rate is so high that FOIR > 60% -> REJECT
    if row['FOIR'] > 60:
        return 0

    # 3. SOFT CONSTRAINT: Processing Fee High + Borderline Credit
    # If Fee > 2.5% AND Credit Score is weak (< 700), user likely declines or bank sees risk
    if row['Processing_Fee_Percentage'] > 2.5 and row['Credit_Score'] < 700:
        return 0

    # 4. HARD CONSTRAINT: Age Eligibility
    # If (Age + Loan Tenure) > 60 (Retirement age), usually rejected
    if (row['Age'] + row['Tenure_Years']) > 60:
        return 0

    # 5. BASE LOGIC: Keep original label if it passes all checks above
    return row['Loan_Status']

# Apply the new logic
df['Loan_Status'] = df.apply(smart_label, axis=1)


# --- STEP 4: CLEANUP & SAVE ---
# We keep the Input features and the Target. 
# We DROP 'Monthly_EMI' and 'FOIR' because the Model should LEARN to calculate these correlations itself.
final_features = [
    'Monthly_Income', 'Current_EMIs', 'Employment_Type', 'Credit_Score', 
    'Loan_Amount', 'Tenure_Years', 'Age', 
    'Bank_Interest_Rate', 'Processing_Fee_Percentage', 
    'Minimum_Tenure_Allowed', 'Maximum_Tenure_Allowed', 
    'Loan_Status'
]

final_df = df[final_features]

final_df.to_csv('enhanced_loan_data.csv', index=False)
print("✅ enhanced_loan_data.csv created successfully!")
print("Columns included:", final_features)
print(final_df.head(10))