import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTENC
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# 1. Load Data
df = pd.read_csv('enhanced_loan_data.csv')
print(f"Loaded dataset with {len(df)} rows.")

# 2. Separate Features and Target
X = df.drop(columns=['Loan_Status'])
y = df['Loan_Status']

# 3. Split First
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Apply SMOTENC on Training Data Only
categorical_features_mask = [col == 'Employment_Type' for col in X_train.columns]
smotenc = SMOTENC(categorical_features=categorical_features_mask, random_state=42)
X_train_resampled, y_train_resampled = smotenc.fit_resample(X_train, y_train)
print(f"After SMOTENC — Class distribution: {y_train_resampled.value_counts().to_dict()}")

# 5. One-Hot Encode Employment_Type
X_train_resampled = pd.get_dummies(X_train_resampled, columns=['Employment_Type'], drop_first=False)
X_test = pd.get_dummies(X_test, columns=['Employment_Type'], drop_first=False)
X_train_resampled, X_test = X_train_resampled.align(X_test, join='outer', axis=1, fill_value=0)

# 6. Build monotonic constraints: Credit_Score can only push approval probability
#    UP as it increases, never down. Everything else is unconstrained (0).
monotone_constraints = tuple(
    1 if col == 'Credit_Score' else 0
    for col in X_train_resampled.columns
)
print(f"Monotone constraints: {dict(zip(X_train_resampled.columns, monotone_constraints))}")

# 7. Train XGBoost
print("Training XGBoost model...")
model = XGBClassifier(
    eval_metric='logloss',
    random_state=42,
    monotone_constraints=monotone_constraints,
)
model.fit(X_train_resampled, y_train_resampled)

# 8. Evaluate
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(f"\nModel Trained!")
print(classification_report(y_test, y_pred, target_names=['Rejected', 'Approved']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_prob):.4f}")

# 9. Save Model and Column Structure
joblib.dump(model, 'loan_model.pkl')
joblib.dump(X_train_resampled.columns.tolist(), 'model_columns.pkl')
print("\nModel saved as 'loan_model.pkl'")
print("Column structure saved as 'model_columns.pkl'")

# 10. Sanity check: sweep Credit_Score, hold everything else fixed, confirm monotonic
print("\n--- Monotonicity sanity check (credit score sweep) ---")
base_row = X_test.iloc[[0]].copy()
for score in [550, 600, 650, 680, 700, 720, 750, 800]:
    row = base_row.copy()
    row['Credit_Score'] = score
    prob = model.predict_proba(row)[0][1] * 100
    print(f"Credit score {score}: {prob:.2f}%")