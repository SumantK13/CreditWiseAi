import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTENC
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# 1. Load Data
try:
    df = pd.read_csv('enhanced_loan_data.csv')
    print(f"Loaded dataset with {len(df)} rows.")
except FileNotFoundError:
    print("Error: 'enhanced_loan_data.csv' not found.")
    exit()

# 2. Separate Features and Target (before encoding, so SMOTENC can handle categoricals)
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

# 5. One-Hot Encode Employment_Type (after resampling)
X_train_resampled = pd.get_dummies(X_train_resampled, columns=['Employment_Type'], drop_first=False)
X_test = pd.get_dummies(X_test, columns=['Employment_Type'], drop_first=False)
X_train_resampled, X_test = X_train_resampled.align(X_test, join='outer', axis=1, fill_value=0)

# 6. Train XGBoost
print("Training XGBoost model...")
model = XGBClassifier(eval_metric='logloss', random_state=42)
model.fit(X_train_resampled, y_train_resampled)

# 7. Evaluate
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(f"\nModel Trained!")
print(classification_report(X_test.index, y_pred)) if False else None
print(classification_report(y_test, y_pred, target_names=['Rejected', 'Approved']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_prob):.4f}")

# 8. Save Model and Column Structure
joblib.dump(model, 'loan_model.pkl')
joblib.dump(X_train_resampled.columns.tolist(), 'model_columns.pkl')
print("\nModel saved as 'loan_model.pkl'")
print("Column structure saved as 'model_columns.pkl'")