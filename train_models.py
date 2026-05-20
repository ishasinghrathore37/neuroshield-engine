import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import time

print("⏳ Data is loading...")
X_train = np.load('models/X_train.npy')
X_test = np.load('models/X_test.npy')
y_train = np.load('models/y_train.npy')
y_test = np.load('models/y_test.npy')
le = joblib.load('models/label_encoder.pkl')
print("✅ Data loaded!")

# ════════════════════════════════════════
# MODEL 1 — Random Forest (Main Classifier)
# ════════════════════════════════════════
print("\n🌲 Random Forest is trained...")
start = time.time()

rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=20,
    random_state=42,
    n_jobs=-1  
)
rf_model.fit(X_train, y_train)

rf_time = time.time() - start
rf_preds = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_preds)

print(f"✅ Random Forest Done! ({rf_time:.1f} sec)")
print(f"🎯 Accuracy: {rf_accuracy * 100:.2f}%")
print("\n📊 Detailed Report:")
print(classification_report(y_test, rf_preds, target_names=le.classes_))

print("\n🔍 Isolation Forest train ho raha hai...")
start = time.time()

iso_model = IsolationForest(
    n_estimators=100,
    contamination=0.1,
    random_state=42,
    n_jobs=-1
)
iso_model.fit(X_train)

iso_time = time.time() - start
iso_preds = iso_model.predict(X_test)


iso_preds_binary = [1 if p == -1 else 0 for p in iso_preds]
iso_accuracy = accuracy_score(y_test, iso_preds_binary)

print(f"✅ Isolation Forest Done! ({iso_time:.1f} sec)")
print(f"🎯 Anomaly Detection Accuracy: {iso_accuracy * 100:.2f}%")


print("\n💾 Models is saving...")
joblib.dump(rf_model, 'models/random_forest.pkl')
joblib.dump(iso_model, 'models/isolation_forest.pkl')

print("\n" + "="*50)
print("🎉 TRAINING COMPLETE!")
print("="*50)
print(f"🌲 Random Forest Accuracy:     {rf_accuracy*100:.2f}%")
print(f"🔍 Isolation Forest Accuracy:  {iso_accuracy*100:.2f}%")
print("✅ models/ saved in folder!")