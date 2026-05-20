import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import joblib
import os

print("⏳ Data is loading...")
df = pd.read_csv('data/cicids2017_cleaned.csv', nrows=50000)
df.columns = df.columns.str.strip()


df.replace([np.inf, -np.inf], np.nan, inplace=True)
df.dropna(inplace=True)


X = df.drop('Attack Type', axis=1)
y = df['Attack Type']


le = LabelEncoder()
y_encoded = le.fit_transform(y)
print(f"✅ Classes: {le.classes_}")


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


print("⏳ SMOTE se data balance ho raha hai...")
smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X_scaled, y_encoded)
print(f"✅ Balanced Data: {pd.Series(y_balanced).value_counts().to_dict()}")


X_train, X_test, y_train, y_test = train_test_split(
    X_balanced, y_balanced, 
    test_size=0.2, 
    random_state=42
)

print(f"✅ Train Size: {len(X_train):,}")
print(f"✅ Test Size: {len(X_test):,}")


os.makedirs('models', exist_ok=True)
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(le, 'models/label_encoder.pkl')
np.save('models/X_train.npy', X_train)
np.save('models/X_test.npy', X_test)
np.save('models/y_train.npy', y_train)
np.save('models/y_test.npy', y_test)

print("\n✅ Preprocessing Done! Models folder mein save ho gaya!")