import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib


df = pd.read_csv('loan_data.csv')

X = df.drop(columns=['Loan_Status'])
y = df['Loan_Status']

numeric_features = ['Monthly_Income', 'Current_EMIs', 'Credit_Score', 'Loan_Amount', 'Tenure_Years']
categorical_features = ['Employment_Type']

# 4. Build the Preprocessing Pipeline (The "Proper" Way)
# - Numeric values get Scaled (StandardScaler)
# - Categories get One-Hot Encoded (e.g., Salaried -> [1, 0, 0])
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(), categorical_features)
    ])

# 5. Create the Full Pipeline (Preprocessing + Model)
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])

# 6. Split Data (80% for training, 20% for testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. Train the Model
print("Training the model...")
model.fit(X_train, y_train)

# 8. Check Accuracy
accuracy = model.score(X_test, y_test)
print(f"✅ Model Trained! Accuracy: {accuracy:.2%}")

# 9. Save the Model
joblib.dump(model, 'loan_model.pkl')
print("💾 Model saved as 'loan_model.pkl'")