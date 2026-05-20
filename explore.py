import pandas as pd
import numpy as np

print("⏳ Data load ho raha hai...")


df = pd.read_csv('data/cicids2017_cleaned.csv', nrows=50000)


df.columns = df.columns.str.strip()

print("✅ Dataset Loaded!")
print(f"📊 Total Rows: {len(df):,}")
print(f"📋 Total Columns: {len(df.columns)}")
print(f"\n🎯 Attack Types:")
print(df['Attack Type'].value_counts())
print(f"\n❓ Missing Values: {df.isnull().sum().sum()}")