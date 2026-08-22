"""
generate_data.py
-----------------
Builds a synthetic bank-loan training dataset with a REALISTIC, non-deterministic
approval label.

WHY THIS VERSION IS DIFFERENT FROM THE ORIGINAL
-------------------------------------------------
The previous version mostly passed `Loan_Status` through from `loan_data.csv`,
only flipping 1 -> 0 for a few extra rule violations. That's fine for genuine
hard rules (tenure limits, retirement-age cutoffs) - but the SOURCE
`Loan_Status` column itself turned out to have a deterministic cutoff around
Credit_Score = 650: 100% rejection below it, zero exceptions across 1,600+
rows. A tree-based model trained on a perfectly deterministic label learns a
hard step function and reports extreme, overconfident probabilities (0.08%
vs 99.8%) right at that boundary - which is exactly the bug you were chasing.

This version stops trusting that column. Instead it:
  1. Keeps genuine bank POLICY rules as hard constraints (tenure outside the
     bank's allowed range, age + tenure past retirement) - these really are
     yes/no rules in real lending.
  2. Turns everything that represents actual RISK (credit score, affordability,
     leverage, fees, interest rate, employment type) into a continuous score,
     passed through a sigmoid to get a probability, then samples the final
     label from that probability with numpy's binomial draw.

The result: applicants near a boundary (say, credit score 640 vs 660) land in
overlapping, sensible probability ranges instead of on opposite sides of a
cliff, and the model has an actual gradient to learn instead of a switch.

NOTE: this is still synthetic data for prototyping, not real historical
underwriting outcomes. The weights below are a reasonable starting point, not
ground truth - tune them against real approval-rate benchmarks if you have
any, or adjust by eye using the sanity check printed at the end of this
script.
"""

import numpy as np
import pandas as pd

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# ---------------------------------------------------------------------------
# STEP 1: Load base applicant data
# ---------------------------------------------------------------------------
df = pd.read_csv('enhanced_loan_data.csv')

required_cols = [
    'Monthly_Income', 'Current_EMIs', 'Employment_Type',
    'Credit_Score', 'Loan_Amount', 'Tenure_Years',
]
missing = [c for c in required_cols if c not in df.columns]
if missing:
    raise ValueError(f"loan_data.csv is missing expected columns: {missing}")

# We intentionally do NOT reuse the original Loan_Status column as our base
# label - see the module docstring for why. Keep applicant feature columns only.
df = df[required_cols].copy()
n = len(df)

# ---------------------------------------------------------------------------
# STEP 2: Generate synthetic bank-offer features
# ---------------------------------------------------------------------------
df['Age'] = np.random.randint(21, 60, size=n)
df['Bank_Interest_Rate'] = np.round(np.random.uniform(8.5, 18.0, size=n), 2)
df['Processing_Fee_Percentage'] = np.round(np.random.uniform(0.5, 3.0, size=n), 2)
df['Minimum_Tenure_Allowed'] = np.random.randint(1, 4, size=n)
df['Maximum_Tenure_Allowed'] = np.random.randint(10, 31, size=n)

# ---------------------------------------------------------------------------
# STEP 3: Real-world affordability metrics
# ---------------------------------------------------------------------------
def calculate_emi(row):
    principal = row['Loan_Amount']
    monthly_rate = (row['Bank_Interest_Rate'] / 12) / 100
    n_months = row['Tenure_Years'] * 12
    if monthly_rate == 0:
        return principal / n_months
    growth = (1 + monthly_rate) ** n_months
    return principal * monthly_rate * growth / (growth - 1)

df['Monthly_EMI'] = df.apply(calculate_emi, axis=1)
df['Total_Monthly_Debt'] = df['Current_EMIs'] + df['Monthly_EMI']
df['FOIR'] = (df['Total_Monthly_Debt'] / df['Monthly_Income']) * 100
df['Loan_To_Annual_Income'] = df['Loan_Amount'] / (df['Monthly_Income'] * 12)

# ---------------------------------------------------------------------------
# STEP 4: HARD constraints (real bank policy - kept deterministic on purpose)
# ---------------------------------------------------------------------------
tenure_violation = (
    (df['Tenure_Years'] < df['Minimum_Tenure_Allowed']) |
    (df['Tenure_Years'] > df['Maximum_Tenure_Allowed'])
)
retirement_violation = (df['Age'] + df['Tenure_Years']) > 60
hard_reject = tenure_violation | retirement_violation

# ---------------------------------------------------------------------------
# STEP 5: SOFT risk score -> smooth probability (this is the actual fix)
# ---------------------------------------------------------------------------
# Each component is centered/scaled so a "typical" applicant sits near 0, and
# the weights control how strongly each factor swings the final probability.
credit_component = (df['Credit_Score'] - 300) / 550 - 0.5     # roughly -0.5..+0.5
foir_component = df['FOIR'] / 100                               # 0 = no debt burden
fee_component = df['Processing_Fee_Percentage'] / 3.0            # 0..1
rate_component = (df['Bank_Interest_Rate'] - 8.5) / 9.5           # 0..1
# log1p compresses the loan-to-income ratio instead of hard-clipping it, so a
# handful of very large loans don't swamp every other factor in the score.
leverage_component = np.log1p(df['Loan_To_Annual_Income'])

employment_adjustment = df['Employment_Type'].map({
    'Salaried': 0.20,
    'Self-Employed': 0.00,
    'Student': -0.50,
}).fillna(0.0)

noise = np.random.normal(loc=0.0, scale=0.35, size=n)  # real-world unpredictability,
                                                          # kept small so it doesn't
                                                          # drown out the signal

risk_score = (
    3.2 * credit_component
    - 1.6 * foir_component
    - 0.3 * fee_component
    - 0.3 * rate_component
    - 0.6 * leverage_component
    + employment_adjustment
    + noise
)

approval_probability = 1 / (1 + np.exp(-risk_score))
approval_probability = np.clip(approval_probability, 0.02, 0.98)  # keep some uncertainty everywhere

# ---------------------------------------------------------------------------
# STEP 6: Sample the actual label from that probability
# ---------------------------------------------------------------------------
sampled_label = np.random.binomial(1, approval_probability)
df['Loan_Status'] = np.where(hard_reject, 0, sampled_label)

# ---------------------------------------------------------------------------
# STEP 7: Cleanup and save
# ---------------------------------------------------------------------------
final_features = [
    'Monthly_Income', 'Current_EMIs', 'Employment_Type', 'Credit_Score',
    'Loan_Amount', 'Tenure_Years', 'Age',
    'Bank_Interest_Rate', 'Processing_Fee_Percentage',
    'Minimum_Tenure_Allowed', 'Maximum_Tenure_Allowed',
    'Loan_Status',
]
final_df = df[final_features]
final_df.to_csv('enhanced_loan_data.csv', index=False)

print("✅ enhanced_loan_data.csv created successfully!")
print("Columns included:", final_features)
print(final_df.head(10))

# ---------------------------------------------------------------------------
# STEP 8: Sanity check - same style test that caught the original cliff
# ---------------------------------------------------------------------------
bins = pd.cut(final_df['Credit_Score'], bins=range(300, 851, 25))
summary = final_df.groupby(bins)['Loan_Status'].agg(['count', 'mean'])
print("\nApproval rate by credit score band (should now be a smooth curve, not a cliff):")
print(summary)