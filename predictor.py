import numpy as np
import joblib
import pandas as pd
from typing import Dict

class ThreatPredictor:
    
    def __init__(self):
        print("⏳ ML Models load ho rahe hain...")
        import os
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        MODELS_DIR = os.path.join(BASE_DIR, 'models')

        self.rf_model = joblib.load(os.path.join(MODELS_DIR, 'random_forest.pkl'))
        self.iso_model = joblib.load(os.path.join(MODELS_DIR, 'isolation_forest.pkl'))
        self.scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
        self.le = joblib.load(os.path.join(MODELS_DIR, 'label_encoder.pkl'))
       
        self.feature_count = 52  # 53 columns - 1 target
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
            
            
            severity = self._get_severity(attack_type, confidence, is_anomaly)
            
            return {
                "is_threat": is_threat,
                "attack_type": attack_type,
                "confidence": round(confidence * 100, 2),
                "severity": severity,
                "is_anomaly": is_anomaly,
                "recommendation": self._get_recommendation(attack_type)
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def _get_severity(self, attack_type, confidence, is_anomaly):
        if attack_type == 'Normal Traffic':
            return 'none'
        elif confidence > 0.95:
            return 'critical'
        elif confidence > 0.80:
            return 'high'
        elif is_anomaly:
            return 'medium'
        return 'low'
    
    def _get_recommendation(self, attack_type):
        recommendations = {
            'Port Scanning': '🛡️ Block source IP immediately. Enable port scan detection.',
            'Normal Traffic': '✅ No action needed.',
        }
        return recommendations.get(attack_type, '⚠️ Investigate and monitor.')


predictor = ThreatPredictor()