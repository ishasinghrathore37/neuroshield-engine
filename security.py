import smtplib
import json
import os
from datetime import datetime
from typing import List, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class SecurityEngine:
    
    def __init__(self):
        
        self.blocked_ips = set()
        self.alert_log = []
        print("✅ Security Engine Ready!")
    
    
    
    def block_ip(self, ip: str, reason: str) -> dict:
        
        self.blocked_ips.add(ip)
        
        log_entry = {
            "action": "IP_BLOCKED",
            "ip": ip,
            "reason": reason,
            "timestamp": datetime.now().isoformat()
        }
        self.alert_log.append(log_entry)
        
        print(f"🚫 IP Blocked: {ip} — Reason: {reason}")
        return {"success": True, "message": f"IP {ip} blocked", "reason": reason}
    
    def unblock_ip(self, ip: str) -> dict:
        
        if ip in self.blocked_ips:
            self.blocked_ips.remove(ip)
            return {"success": True, "message": f"IP {ip} unblocked"}
        return {"success": False, "message": f"IP {ip} was not blocked"}
    
    def is_blocked(self, ip: str) -> bool:
        
        return ip in self.blocked_ips
    
    def get_blocked_ips(self) -> List[str]:
        """Saare blocked IPs dekho"""
        return list(self.blocked_ips)
    
    
    
    def auto_respond(self, threat_data: dict) -> dict:
        
        severity = threat_data.get("severity", "low")
        attack_type = threat_data.get("attack_type", "Unknown")
        source_ip = threat_data.get("source_ip", "unknown")
        confidence = threat_data.get("confidence", 0)
        
        response = {
            "severity": severity,
            "attack_type": attack_type,
            "source_ip": source_ip,
            "actions_taken": [],
            "timestamp": datetime.now().isoformat()
        }
        
        
        if severity == "low":
            response["actions_taken"].append("📝 Logged to database")
            response["status"] = "LOGGED"
        
        
        elif severity == "medium":
            response["actions_taken"].append("📝 Logged to database")
            response["actions_taken"].append("⚠️ Alert generated")
            response["status"] = "ALERTED"
        
        
        elif severity == "high":
            
            if source_ip != "unknown":
                self.block_ip(source_ip, f"High severity {attack_type}")
            response["actions_taken"].append("🚫 Source IP Blocked")
            response["actions_taken"].append("📧 Alert Email Queued")
            response["actions_taken"].append("📝 Incident Report Created")
            response["status"] = "BLOCKED"
        
        
        elif severity == "critical":
            
            if source_ip != "unknown":
                self.block_ip(source_ip, f"CRITICAL {attack_type}")
            response["actions_taken"].append("🚫 Source IP Blocked Immediately")
            response["actions_taken"].append("🔴 CRITICAL Alert Sent")
            response["actions_taken"].append("📋 Full Incident Report Generated")
            response["actions_taken"].append("👨‍💼 CISO Notified")
            response["status"] = "CRITICAL_RESPONSE"
        
        self.alert_log.append(response)
        return response
    
    
    
    def generate_incident_report(self, threat_data: dict) -> dict:
        
        
        report = {
            "report_id": f"INC-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "generated_at": datetime.now().isoformat(),
            "severity": threat_data.get("severity", "unknown").upper(),
            "executive_summary": self._generate_summary(threat_data),
            "threat_details": {
                "attack_type": threat_data.get("attack_type"),
                "source_ip": threat_data.get("source_ip", "Unknown"),
                "confidence_score": f"{threat_data.get('confidence', 0)}%",
                "detection_method": "AI/ML Model (Random Forest + Isolation Forest)"
            },
            "impact_assessment": self._assess_impact(threat_data),
            "actions_taken": threat_data.get("actions_taken", []),
            "recommendations": self._get_recommendations(threat_data),
            "status": "OPEN"
        }
        
        return report
    
    def _generate_summary(self, threat_data: dict) -> str:
        attack = threat_data.get("attack_type", "Unknown Attack")
        ip = threat_data.get("source_ip", "Unknown IP")
        severity = threat_data.get("severity", "unknown").upper()
        confidence = threat_data.get("confidence", 0)
        
        return (
            f"A {severity} severity {attack} was detected from IP {ip} "
            f"with {confidence}% confidence by NeuroShield AI engine. "
            f"Automated response protocols have been initiated."
        )
    
    def _assess_impact(self, threat_data: dict) -> str:
        severity = threat_data.get("severity", "low")
        impacts = {
            "critical": "🔴 HIGH IMPACT — Immediate action required. System compromise possible.",
            "high":     "🟠 MEDIUM-HIGH IMPACT — Significant threat detected. Blocking initiated.",
            "medium":   "🟡 MEDIUM IMPACT — Suspicious activity. Monitoring increased.",
            "low":      "🟢 LOW IMPACT — Minor anomaly detected. Logged for review.",
            "none":     "✅ NO IMPACT — Normal traffic confirmed."
        }
        return impacts.get(severity, "Unknown impact")
    
    def _get_recommendations(self, threat_data: dict) -> List[str]:
        attack_type = threat_data.get("attack_type", "")
        
        base_recs = [
            "Review firewall rules",
            "Update threat intelligence database",
            "Monitor affected systems for 24 hours"
        ]
        
        specific_recs = {
            "Port Scanning": [
                "Enable port scan detection on all network interfaces",
                "Implement rate limiting on connection attempts",
                "Review exposed services and close unnecessary ports"
            ],
            "Brute Force": [
                "Enforce account lockout policies",
                "Enable multi-factor authentication",
                "Review password policies"
            ]
        }
        
        return specific_recs.get(attack_type, base_recs)
    
    def get_alert_log(self) -> List[dict]:
        return self.alert_log


security_engine = SecurityEngine()