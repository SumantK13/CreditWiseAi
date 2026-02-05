import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# 1. Load the Augmented Data
# Use the file created by the augmentation script
try:
    df = pd.read_csv('enhanced_loan_data.csv') # Or 'final_loan_data_augmented.csv'
    print(f"Loaded dataset with {len(df)} rows.")
except FileNotFoundError:
    print("Error: 'enhanced_loan_data.csv' not found. Please run the augmentation script first.")
    exit()

# 2. Separate Features (X) and Target (y)
X = df.drop(columns=['Loan_Status'])
y = df['Loan_Status']

# 3. Define Features
numeric_features = [
    'Monthly_Income', 
    'Current_EMIs', 
    'Credit_Score', 
    'Loan_Amount', 
    'Tenure_Years',
    'Age',                        
    'Bank_Interest_Rate',         
    'Processing_Fee_Percentage',  
    'Minimum_Tenure_Allowed',     
    'Maximum_Tenure_Allowed'      
]

categorical_features = ['Employment_Type']

# 4. Build the Preprocessing Pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# 5. Create the Full Pipeline
# We use LogisticRegression with increased iterations to ensure it learns the new patterns
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000, random_state=42)) 
])

# 6. Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. Train the Model
print("Training Logistic Regression model...")
model.fit(X_train, y_train)

# 8. Check Accuracy
accuracy = model.score(X_test, y_test)
print(f"✅ Model Trained! Accuracy: {accuracy:.2%}")

# 9. Save the Model
joblib.dump(model, 'loan_model.pkl')
print("💾 Model saved as 'loan_model.pkl'")