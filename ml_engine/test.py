import pandas as pd
df = pd.read_csv('enhanced_loan_data.csv')
bins = pd.cut(df['Credit_Score'], bins=range(300, 851, 25))
print(df.groupby(bins)['Loan_Status'].agg(['count', 'mean']))
print(df['Employment_Type'].unique())