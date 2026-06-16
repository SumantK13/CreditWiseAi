import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# 1. Load Data
try:
    df = pd.read_csv('enhanced_loan_data.csv')
    print(f"✅ Loaded dataset with {len(df)} rows.")
except FileNotFoundError:
    print("❌ Error: 'enhanced_loan_data.csv' not found.")
    exit()

# 2. One-Hot Encode Employment_Type
df_encoded = pd.get_dummies(df, columns=['Employment_Type'], drop_first=False)

# 3. Separate Features and Target
X = df_encoded.drop(columns=['Loan_Status'])
y = df_encoded['Loan_Status']

# 4. Split First
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. Apply SMOTE on Training Data Only
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
print(f"After SMOTE — Class distribution: {y_train_resampled.value_counts().to_dict()}")

# 6. Train XGBoost
print("Training XGBoost model...")
model = XGBClassifier(eval_metric='logloss', random_state=42)
model.fit(X_train_resampled, y_train_resampled)

# 7. Evaluate
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(f"\n✅ Model Trained!")
print(classification_report(X_test.index, y_pred)) if False else None
print(classification_report(y_test, y_pred, target_names=['Rejected', 'Approved']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_prob):.4f}")

# 8. Save Model and Column Structure
joblib.dump(model, 'loan_model.pkl')
joblib.dump(X_train_resampled.columns.tolist(), 'model_columns.pkl')
print("\n💾 Model saved as 'loan_model.pkl'")
print("💾 Column structure saved as 'model_columns.pkl'")