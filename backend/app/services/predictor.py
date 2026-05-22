import os

os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import numpy as np
import joblib
import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


MODELS_DIR = os.path.join(BASE_DIR, 'models')

print("📂 Models Path:", MODELS_DIR)


class ThreatPredictor:

    def __init__(self):
        print("⏳ ML Models load ho rahe hain...")

        self.rf_model = joblib.load(
            os.path.join(MODELS_DIR, 'random_forest.pkl')
        )

        self.iso_model = joblib.load(
            os.path.join(MODELS_DIR, 'isolation_forest.pkl')
        )

        self.scaler = joblib.load(
            os.path.join(MODELS_DIR, 'scaler.pkl')
        )

        self.le = joblib.load(
            os.path.join(MODELS_DIR, 'label_encoder.pkl')
        )

        print("✅ Models ready!")

    def predict(self, features: list) -> dict:
        try:
            
            X = np.array(features).reshape(1, -1)

        
            X_scaled = self.scaler.transform(X)

        
            rf_pred = self.rf_model.predict(X_scaled)[0]
            rf_proba = self.rf_model.predict_proba(X_scaled)[0]

            
            iso_pred = self.iso_model.predict(X_scaled)[0]

            
            attack_type = self.le.inverse_transform([rf_pred])[0]

        
            confidence = float(max(rf_proba))

            
            is_anomaly = iso_pred == -1

            
            is_threat = attack_type != 'Normal Traffic'

            
            severity = self._get_severity(
                attack_type,
                confidence
            )

            return {
                "is_threat": is_threat,
                "attack_type": attack_type,
                "confidence": round(confidence * 100, 2),
                "severity": severity,
                "is_anomaly": is_anomaly,
                "recommendation": self._get_recommendation(
                    attack_type
                )
            }

        except Exception as e:
            return {
                "error": str(e)
            }

    def _get_severity(self, attack_type, confidence):

        if attack_type == 'Normal Traffic':
            return 'none'

        elif confidence > 0.95:
            return 'critical'

        elif confidence > 0.80:
            return 'high'

        return 'medium'

    def _get_recommendation(self, attack_type):

        recommendations = {
            'Port Scanning':
                '🛡️ Block source IP immediately.',

            'Normal Traffic':
                '✅ No action needed.',
        }

        return recommendations.get(
            attack_type,
            '⚠️ Investigate and monitor.'
        )


predictor = ThreatPredictor()