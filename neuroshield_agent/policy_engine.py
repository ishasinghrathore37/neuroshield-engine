from datetime import datetime
from colorama import Fore, Style

class PolicyEngine:
    
    def __init__(self):
        # Rules define karo
        self.rules = [
            {
                "id": "RULE-001",
                "name": "Critical Process Detection",
                "condition": lambda t: t.get("type") == "SUSPICIOUS_PROCESS",
                "action": "BLOCK",
                "severity": "critical",
                "priority": 1
            },
            {
                "id": "RULE-002", 
                "name": "Port Scan Detection",
                "condition": lambda t: t.get("type") == "PORT_SCAN",
                "action": "ALERT_AND_BLOCK",
                "severity": "high",
                "priority": 2
            },
            {
                "id": "RULE-003",
                "name": "Brute Force Detection",
                "condition": lambda t: t.get("type") == "BRUTE_FORCE",
                "action": "ALERT_AND_BLOCK",
                "severity": "critical",
                "priority": 1
            },
            {
                "id": "RULE-004",
                "name": "C2 Communication",
                "condition": lambda t: t.get("type") == "SUSPICIOUS_CONNECTION",
                "action": "BLOCK_AND_ISOLATE",
                "severity": "critical",
                "priority": 1
            },
            {
                "id": "RULE-005",
                "name": "CPU Spike Detection",
                "condition": lambda t: t.get("type") == "CPU_SPIKE",
                "action": "ALERT",
                "severity": "medium",
                "priority": 3
            },
        ]
    
    def evaluate(self, threat):
        """Threat ke liye best rule find karo"""
        matched_rules = []
        
        for rule in self.rules:
            try:
                if rule["condition"](threat):
                    matched_rules.append(rule)
            except:
                pass
        
        if not matched_rules:
            return self._default_decision(threat)
        
        # Highest priority rule use karo
        best_rule = min(matched_rules, key=lambda r: r["priority"])
        
        return {
            "rule_id": best_rule["id"],
            "rule_name": best_rule["name"],
            "action": best_rule["action"],
            "severity": best_rule["severity"],
            "threat": threat,
            "timestamp": datetime.now().isoformat()
        }
    
    def _default_decision(self, threat):
        return {
            "rule_id": "RULE-DEFAULT",
            "rule_name": "Default Rule",
            "action": "LOG",
            "severity": "low",
            "threat": threat,
            "timestamp": datetime.now().isoformat()
        }
    
    def execute_decision(self, decision):
        """Decision execute karo"""
        action = decision["action"]
        threat = decision["threat"]
        severity = decision["severity"]
        
        color = {
            "critical": Fore.RED,
            "high": Fore.YELLOW,
            "medium": Fore.CYAN,
            "low": Fore.GREEN
        }.get(severity, Fore.WHITE)
        
        print(f"\n{color}{'='*55}")
        print(f"🔰 POLICY ENGINE DECISION")
        print(f"{'='*55}")
        print(f"Rule    : {decision['rule_name']}")
        print(f"Action  : {action}")
        print(f"Severity: {severity.upper()}")
        print(f"Threat  : {threat.get('attack_type')}")
        print(f"Detail  : {threat.get('detail', '')[:60]}")
        print(f"{'='*55}{Style.RESET_ALL}")
        
        return {
            "executed": True,
            "action": action,
            "decision": decision
        }